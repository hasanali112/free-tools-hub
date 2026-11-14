/**
 * Browser-only image helpers shared by the image tools.
 * Heavy libraries (heic2any) are loaded with dynamic import() only when actually needed.
 */

import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";

export type { ProcessResult, ProgressFn, Processor } from "@/components/file-tool/types";

export type OutputFormat = "jpg" | "png" | "webp";

export const MIME: Record<OutputFormat, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/* ---------- file names ---------- */

export function replaceExt(name: string, ext: string) {
  const base = name.replace(/\.[^./\\]+$/, "") || "image";
  return `${base}.${ext}`;
}

export function extOf(name: string) {
  return (name.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
}

/* ---------- format detection ---------- */

export async function sniffType(file: File): Promise<string> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
  if (head[0] === 0xff && head[1] === 0xd8) return "image/jpeg";
  if (head[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (/^(heic|heix|hevc|hevx|heim|heis|mif1|msf1)$/.test(brand)) return "image/heic";
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  if (ascii(0, 3) === "GIF") return "image/gif";
  if (head[0] === 0x42 && head[1] === 0x4d) return "image/bmp";
  return file.type || "application/octet-stream";
}

export function looksLikeHeic(file: File) {
  return /image\/hei[cf]/.test(file.type) || /^(heic|heif)$/.test(extOf(file.name));
}

/* ---------- canvas limits ---------- */

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** iOS Safari refuses canvases larger than ~16.7 megapixels. */
export function maxCanvasPixels() {
  return isIOS() ? 16_777_216 : 100_000_000;
}

export function clampToCanvasLimit(w: number, h: number) {
  const max = maxCanvasPixels();
  if (w * h <= max) return { w, h, scaled: false };
  const k = Math.sqrt(max / (w * h));
  return { w: Math.floor(w * k), h: Math.floor(h * k), scaled: true };
}

/* ---------- decode ---------- */

export interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

async function decodeBlob(blob: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      // `from-image` applies EXIF orientation so photos are the right way up.
      const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      /* fall back to <img> below */
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

/** Decode any supported image (including HEIC/HEIF) into something drawable on a canvas. */
export async function decodeImage(file: File, onProgress?: ProgressFn): Promise<Decoded> {
  const type = await sniffType(file);
  if (type === "image/heic" || looksLikeHeic(file)) {
    // Safari 17+ can decode HEIC natively, which is much faster.
    try {
      return await decodeBlob(file);
    } catch {
      /* use the WebAssembly decoder */
    }
    onProgress?.(0.1);
    const { default: heic2any } = await import("heic2any");
    const out = await heic2any({ blob: file, toType: "image/png" });
    onProgress?.(0.6);
    return decodeBlob(Array.isArray(out) ? out[0] : out);
  }
  try {
    return await decodeBlob(file);
  } catch {
    throw new Error("This file couldn't be read as an image. It may be damaged or in an unsupported format.");
  }
}

/* ---------- encode ---------- */

export function createCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't create a drawing canvas.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("The image was too large for your browser to save."));
        // Safari doesn't encode WebP and silently returns PNG instead.
        if (format === "webp" && blob.type !== "image/webp") {
          return reject(new Error("Your browser can't save WebP files. Choose JPG or PNG instead."));
        }
        resolve(blob);
      },
      MIME[format],
      format === "png" ? undefined : quality,
    );
  });
}

export interface ConvertOptions {
  format: OutputFormat;
  /** 0–1, ignored for PNG. */
  quality?: number;
  /** Fill color for transparent pixels (used for JPG). */
  background?: string;
}

/** Decode, flatten and re-encode an image in a new format. */
export async function convertImage(file: File, opts: ConvertOptions, onProgress?: ProgressFn): Promise<ProcessResult> {
  const img = await decodeImage(file, onProgress);
  try {
    const { w, h, scaled } = clampToCanvasLimit(img.width, img.height);
    const { canvas, ctx } = createCanvas(w, h);
    if (opts.format === "jpg" || opts.background) {
      ctx.fillStyle = opts.background || "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img.source, 0, 0, w, h);
    onProgress?.(0.8);
    const blob = await canvasToBlob(canvas, opts.format, opts.quality);
    onProgress?.(1);
    return {
      blob,
      name: replaceExt(file.name, opts.format),
      note: scaled ? `Scaled to ${w}×${h} (browser limit)` : undefined,
    };
  } finally {
    img.close();
  }
}
