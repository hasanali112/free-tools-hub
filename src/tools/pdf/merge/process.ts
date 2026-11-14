import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { loadPdfLib, nextFrame, openPdf, pdfBlob } from "../_shared/pdf";

export async function mergePdfs(files: File[], onProgress: ProgressFn): Promise<ProcessResult> {
  const { PDFDocument } = await loadPdfLib();
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    let src;
    try {
      src = await openPdf(files[i]);
    } catch (e) {
      throw new Error(`${files[i].name}: ${(e as Error).message}`);
    }
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    onProgress((i + 1) / (files.length + 1));
    await nextFrame();
  }
  const bytes = await out.save({ useObjectStreams: true });
  onProgress(1);
  const count = out.getPageCount();
  return { blob: pdfBlob(bytes), name: "merged.pdf", note: `${count} page${count > 1 ? "s" : ""}` };
}
