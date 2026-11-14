import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { convertImage, sniffType } from "@/tools/image/_shared/image";
import { baseName, loadPdfLib, nextFrame, pdfBlob } from "../_shared/pdf";

export type PageSize = "fit" | "letter" | "a4";
export type Orientation = "auto" | "portrait" | "landscape";

export interface ImagesToPdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  /** Margin in points (72 pt = 1 inch). */
  margin: number;
}

const SIZES = { letter: [612, 792], a4: [595.28, 841.89] } as const;

/** Read the EXIF orientation of a JPEG (1 = upright). */
function jpegOrientation(b: Uint8Array) {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let i = 2;
  while (i + 4 < b.length && b[i] === 0xff) {
    const marker = b[i + 1];
    if (marker === 0xda) break;
    const len = v.getUint16(i + 2);
    if (marker === 0xe1 && String.fromCharCode(...b.subarray(i + 4, i + 8)) === "Exif") {
      const t = i + 10;
      const le = v.getUint16(t) === 0x4949;
      const ifd = t + v.getUint32(t + 4, le);
      const n = v.getUint16(ifd, le);
      for (let k = 0; k < n; k++) {
        const e = ifd + 2 + k * 12;
        if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le);
      }
    }
    i += 2 + len;
  }
  return 1;
}

/**
 * Get bytes pdf-lib can embed. Upright JPGs and PNGs are embedded as-is (no quality loss);
 * everything else (HEIC, WebP, rotated photos) is converted to a high-quality JPG first.
 */
async function embeddable(file: File): Promise<{ bytes: Uint8Array; kind: "jpg" | "png" }> {
  const type = await sniffType(file);
  if (type === "image/png") return { bytes: new Uint8Array(await file.arrayBuffer()), kind: "png" };
  if (type === "image/jpeg") {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let orientation = 1;
    try {
      orientation = jpegOrientation(bytes);
    } catch {
      /* treat as upright */
    }
    if (orientation <= 1) return { bytes, kind: "jpg" };
  }
  const { blob } = await convertImage(file, { format: "jpg", quality: 0.92 });
  return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "jpg" };
}

export async function imagesToPdf(files: File[], opts: ImagesToPdfOptions, onProgress: ProgressFn): Promise<ProcessResult> {
  const { PDFDocument } = await loadPdfLib();
  const pdf = await PDFDocument.create();
  pdf.setProducer("");
  pdf.setCreator("");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let image;
    try {
      const { bytes, kind } = await embeddable(file);
      image = kind === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    } catch (e) {
      throw new Error(`${file.name}: ${e instanceof Error && e.message ? e.message : "couldn't be read as an image."}`);
    }

    let pageW: number, pageH: number;
    if (opts.pageSize === "fit") {
      // 96 px per inch → points, plus margins.
      pageW = (image.width * 72) / 96 + opts.margin * 2;
      pageH = (image.height * 72) / 96 + opts.margin * 2;
    } else {
      const [w, h] = SIZES[opts.pageSize];
      const landscape = opts.orientation === "landscape" || (opts.orientation === "auto" && image.width > image.height);
      [pageW, pageH] = landscape ? [h, w] : [w, h];
    }

    const boxW = pageW - opts.margin * 2;
    const boxH = pageH - opts.margin * 2;
    const scale = Math.min(boxW / image.width, boxH / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    const page = pdf.addPage([pageW, pageH]);
    page.drawImage(image, { x: (pageW - w) / 2, y: (pageH - h) / 2, width: w, height: h });

    onProgress((i + 1) / (files.length + 1));
    await nextFrame();
  }

  const bytes = await pdf.save();
  onProgress(1);
  const name = files.length === 1 ? `${baseName(files[0].name)}.pdf` : "images.pdf";
  return { blob: pdfBlob(bytes), name, note: `${files.length} page${files.length > 1 ? "s" : ""}` };
}
