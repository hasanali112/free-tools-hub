import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import {
  canvasToBlob,
  clampToCanvasLimit,
  createCanvas,
  decodeImage,
  replaceExt,
  sniffType,
  type OutputFormat,
} from "../_shared/image";
import type { Fit } from "./presets";

export type ResizeSpec =
  | { kind: "exact"; width: number; height: number; fit: Fit }
  | { kind: "width"; width: number }
  | { kind: "percent"; percent: number };

export interface ResizeOptions {
  spec: ResizeSpec;
  /** "same" keeps JPG/PNG/WebP; other inputs (e.g. HEIC) become JPG. */
  format: OutputFormat | "same";
  quality: number;
  maxKB?: number;
  background: string;
}

const EXT: Record<string, OutputFormat> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function resizeImage(file: File, opts: ResizeOptions, onProgress: ProgressFn): Promise<ProcessResult> {
  const format: OutputFormat = opts.format === "same" ? EXT[await sniffType(file)] || "jpg" : opts.format;
  const img = await decodeImage(file, onProgress);
  try {
    const sw = img.width;
    const sh = img.height;
    const { spec } = opts;

    // Output canvas size
    let W: number, H: number;
    if (spec.kind === "exact") [W, H] = [spec.width, spec.height];
    else if (spec.kind === "width") [W, H] = [spec.width, Math.round((sh * spec.width) / sw)];
    else [W, H] = [Math.round((sw * spec.percent) / 100), Math.round((sh * spec.percent) / 100)];
    const limited = clampToCanvasLimit(Math.max(1, W), Math.max(1, H));
    W = limited.w;
    H = limited.h;

    // Where the image goes on the canvas
    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
    let dx = 0, dy = 0, dWidth = W, dHeight = H;
    if (spec.kind === "exact" && spec.fit === "crop") {
      const scale = Math.max(W / sw, H / sh);
      sWidth = W / scale;
      sHeight = H / scale;
      sx = (sw - sWidth) / 2;
      sy = (sh - sHeight) / 2;
    } else if (spec.kind === "exact" && spec.fit === "fit") {
      const scale = Math.min(W / sw, H / sh);
      dWidth = sw * scale;
      dHeight = sh * scale;
      dx = (W - dWidth) / 2;
      dy = (H - dHeight) / 2;
    }

    const source = downscaleSource(img.source, sx, sy, sWidth, sHeight, dWidth, dHeight);
    onProgress(0.75);

    const { canvas, ctx } = createCanvas(W, H);
    if (format === "jpg" || (spec.kind === "exact" && spec.fit === "fit")) {
      ctx.fillStyle = opts.background;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.drawImage(source.image, source.sx, source.sy, source.sw, source.sh, dx, dy, dWidth, dHeight);

    let quality = opts.quality;
    let blob = await canvasToBlob(canvas, format, quality);
    // Size cap (e.g. DV lottery 240KB): lower quality until it fits.
    if (opts.maxKB && format !== "png") {
      while (blob.size > opts.maxKB * 1024 && quality > 0.3) {
        quality -= 0.05;
        blob = await canvasToBlob(canvas, format, quality);
      }
    }
    onProgress(1);
    return {
      blob,
      name: replaceExt(file.name, format).replace(/(\.[^.]+)$/, `-${W}x${H}$1`),
      note: `${sw}×${sh} → ${W}×${H}`,
    };
  } finally {
    img.close();
  }
}

/**
 * Big reductions in one step look jagged. Halve the image repeatedly until it's
 * less than 2× the target, then do the final draw from that intermediate canvas.
 */
function downscaleSource(
  image: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  tw: number,
  th: number,
) {
  let cur = { image, sx, sy, sw, sh };
  while (cur.sw > tw * 2 && cur.sh > th * 2) {
    const w = Math.round(cur.sw / 2);
    const h = Math.round(cur.sh / 2);
    const { canvas, ctx } = createCanvas(w, h);
    ctx.drawImage(cur.image, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, w, h);
    cur = { image: canvas, sx: 0, sy: 0, sw: w, sh: h };
  }
  return { image: cur.image, sx: cur.sx, sy: cur.sy, sw: cur.sw, sh: cur.sh };
}
