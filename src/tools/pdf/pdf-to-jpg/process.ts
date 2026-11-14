import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { canvasToBlob, type OutputFormat } from "@/tools/image/_shared/image";
import { baseName, nextFrame, openPdfForRender, pad, parseRanges } from "../_shared/pdf";
import { freeCanvas, renderPage } from "../_shared/render";

export interface PdfToImageOptions {
  dpi: number;
  format: Extract<OutputFormat, "jpg" | "png">;
  quality: number;
  /** Empty = all pages, otherwise ranges such as "1-3, 5". */
  pages: string;
}

export async function pdfToImages(file: File, opts: PdfToImageOptions, onProgress: ProgressFn): Promise<ProcessResult[]> {
  const doc = await openPdfForRender(file);
  try {
    const total = doc.numPages;
    const pages = opts.pages.trim()
      ? [...new Set(parseRanges(opts.pages, total).flat())].sort((a, b) => a - b).map((i) => i + 1)
      : Array.from({ length: total }, (_, i) => i + 1);
    const base = baseName(file.name);
    const results: ProcessResult[] = [];
    for (let i = 0; i < pages.length; i++) {
      const n = pages[i];
      const { canvas } = await renderPage(doc, n, opts.dpi);
      const note = `${canvas.width}×${canvas.height}`;
      const blob = await canvasToBlob(canvas, opts.format, opts.quality);
      freeCanvas(canvas);
      results.push({ blob, name: `${base}-page-${pad(n, total)}.${opts.format}`, note });
      onProgress((i + 1) / pages.length);
      await nextFrame();
    }
    return results;
  } finally {
    await doc.loadingTask.destroy();
  }
}
