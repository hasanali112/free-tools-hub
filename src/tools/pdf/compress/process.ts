import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { canvasToBlob } from "@/tools/image/_shared/image";
import { loadPdfLib, nextFrame, openPdf, openPdfForRender, pdfBlob } from "../_shared/pdf";
import { freeCanvas, renderPage } from "../_shared/render";

export type CompressLevel = "light" | "medium" | "strong";

/** DPI and JPEG quality used when pages are turned into images. */
const RASTER = {
  medium: { dpi: 150, quality: 0.65 },
  strong: { dpi: 100, quality: 0.5 },
} as const;

export async function compressPdf(file: File, level: CompressLevel, onProgress: ProgressFn): Promise<ProcessResult> {
  const blob = level === "light" ? await lossless(file, onProgress) : await rasterize(file, RASTER[level], onProgress);
  onProgress(1);
  if (blob.size >= file.size) {
    return { blob: file, name: file.name, note: "Already optimized — kept original" };
  }
  return {
    blob,
    name: file.name.replace(/(\.pdf)?$/i, "-compressed.pdf"),
    note: level === "light" ? "Text kept selectable" : `${RASTER[level].dpi} DPI · text is now an image`,
  };
}

/** Re-save the PDF with compact object streams and without unused objects. Keeps everything selectable. */
async function lossless(file: File, onProgress: ProgressFn) {
  const doc = await openPdf(file);
  onProgress(0.5);
  doc.setProducer("");
  doc.setCreator("");
  const bytes = await doc.save({ useObjectStreams: true });
  return pdfBlob(bytes);
}

/** Render every page to a JPEG and build a new PDF from those images (big savings for scans and photos). */
async function rasterize(file: File, cfg: { dpi: number; quality: number }, onProgress: ProgressFn) {
  const { PDFDocument } = await loadPdfLib();
  const src = await openPdfForRender(file);
  const out = await PDFDocument.create();
  try {
    for (let n = 1; n <= src.numPages; n++) {
      const { canvas, widthPt, heightPt } = await renderPage(src, n, cfg.dpi);
      const jpg = await canvasToBlob(canvas, "jpg", cfg.quality);
      freeCanvas(canvas);
      const image = await out.embedJpg(new Uint8Array(await jpg.arrayBuffer()));
      out.addPage([widthPt, heightPt]).drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });
      onProgress(n / (src.numPages + 1));
      await nextFrame();
    }
  } finally {
    await src.loadingTask.destroy();
  }
  return pdfBlob(await out.save({ useObjectStreams: true }));
}
