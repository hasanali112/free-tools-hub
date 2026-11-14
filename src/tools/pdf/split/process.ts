import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { baseName, loadPdfLib, nextFrame, openPdf, pad, parseRanges, pdfBlob, rangeLabel } from "../_shared/pdf";

export type SplitMode = "every" | "ranges" | "extract";

export interface SplitOptions {
  mode: SplitMode;
  /** Page ranges such as "1-3, 5, 8-" (for "ranges" and "extract"). */
  ranges: string;
}

export async function splitPdf(file: File, opts: SplitOptions, onProgress: ProgressFn): Promise<ProcessResult[]> {
  const { PDFDocument } = await loadPdfLib();
  const src = await openPdf(file);
  const count = src.getPageCount();
  const base = baseName(file.name);

  let groups: number[][];
  if (opts.mode === "every") groups = src.getPageIndices().map((i) => [i]);
  else if (opts.mode === "ranges") groups = parseRanges(opts.ranges, count);
  else groups = [[...new Set(parseRanges(opts.ranges, count).flat())]];

  const results: ProcessResult[] = [];
  for (let g = 0; g < groups.length; g++) {
    const pages = groups[g];
    const out = await PDFDocument.create();
    (await out.copyPages(src, pages)).forEach((p) => out.addPage(p));
    const bytes = await out.save({ useObjectStreams: true });
    const name =
      opts.mode === "extract"
        ? `${base}-extracted.pdf`
        : opts.mode === "every"
          ? `${base}-page-${pad(pages[0] + 1, count)}.pdf`
          : `${base}-${rangeLabel(pages)}.pdf`;
    results.push({ blob: pdfBlob(bytes), name, note: `${pages.length} page${pages.length > 1 ? "s" : ""}` });
    onProgress((g + 1) / groups.length);
    if (g % 5 === 4) await nextFrame();
  }
  return results;
}
