/**
 * Browser-only PDF helpers shared by the PDF tools.
 * pdf-lib (create/edit) and pdf.js (render) are loaded with dynamic import() only when a tool runs.
 */
import type { PDFDocument } from "pdf-lib";
import { asset } from "@/lib/base-path";

export const PDF_MIMES = ["application/pdf", "application/x-pdf"];

export function isPdf(f: File) {
  return PDF_MIMES.includes(f.type) || /\.pdf$/i.test(f.name);
}

export function baseName(name: string) {
  return name.replace(/\.[^./\\]+$/, "") || "document";
}

export function pdfBlob(bytes: Uint8Array) {
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

const ENCRYPTED_MSG = "This PDF is password-protected. Remove the password first, then try again.";
const DAMAGED_MSG = "This file couldn't be read as a PDF. It may be damaged.";

/* ---------- pdf-lib ---------- */

export async function loadPdfLib() {
  return import("pdf-lib");
}

/** Open a PDF with pdf-lib, turning library errors into messages a user understands. */
export async function openPdf(file: File): Promise<PDFDocument> {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    // pdf-lib is lenient and may "open" garbage; make sure the page tree is really there.
    if (doc.getPageCount() < 1 || !doc.getPage(0).getSize().width) throw new Error("no pages");
    return doc;
  } catch (e) {
    if (e instanceof Error && /encrypt/i.test(e.message)) throw new Error(ENCRYPTED_MSG);
    throw new Error(DAMAGED_MSG);
  }
}

/* ---------- pdf.js ---------- */

const VENDOR = asset("/vendor/pdfjs");

export async function loadPdfJs() {
  // Legacy build: works on older iOS Safari versions too.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `${location.origin}${VENDOR}/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

/** Open a PDF for rendering with pdf.js (fonts, CMaps and decoders are self-hosted under /vendor/pdfjs). */
export async function openPdfForRender(file: File) {
  const pdfjs = await loadPdfJs();
  const base = `${location.origin}${VENDOR}`;
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: `${base}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}/standard_fonts/`,
    wasmUrl: `${base}/wasm/`,
    iccUrl: `${base}/iccs/`,
  });
  try {
    return await task.promise;
  } catch (e) {
    const name = (e as { name?: string })?.name;
    if (name === "PasswordException") throw new Error(ENCRYPTED_MSG);
    throw new Error(DAMAGED_MSG);
  }
}

/* ---------- page ranges ---------- */

/**
 * Parse "1-3, 5, 8-" into groups of zero-based page indexes.
 * Throws a readable error for invalid input.
 */
export function parseRanges(input: string, pageCount: number): number[][] {
  const groups: number[][] = [];
  for (const raw of input.split(/[,;]+/)) {
    const part = raw.trim();
    if (!part) continue;
    const m = part.match(/^(\d*)\s*(?:-|–|to)\s*(\d*)$/i) ?? part.match(/^(\d+)$/);
    if (!m) throw new Error(`“${part}” isn't a valid page range. Use something like 1-3, 5, 8-10.`);
    const single = m.length === 2;
    const from = single ? Number(m[1]) : m[1] ? Number(m[1]) : 1;
    const to = single ? from : m[2] ? Number(m[2]) : pageCount;
    if (from < 1 || to < 1) throw new Error("Page numbers start at 1.");
    if (from > pageCount || to > pageCount) {
      throw new Error(`This PDF has only ${pageCount} page${pageCount > 1 ? "s" : ""} — “${part}” is out of range.`);
    }
    const [a, b] = from <= to ? [from, to] : [to, from];
    groups.push(Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i));
  }
  if (!groups.length) throw new Error("Enter the pages you want, e.g. 1-3, 5.");
  return groups;
}

export function rangeLabel(pages: number[]) {
  const first = pages[0] + 1;
  const last = pages[pages.length - 1] + 1;
  return first === last ? `page-${first}` : `pages-${first}-${last}`;
}

/** Zero-padded page number for file names, e.g. 7 of 120 → "007". */
export function pad(n: number, total: number) {
  return String(n).padStart(String(total).length, "0");
}

/** Yield to the browser so progress updates can paint between pages. */
export const nextFrame = () => new Promise((r) => setTimeout(r, 0));
