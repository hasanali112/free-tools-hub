import { clampToCanvasLimit, createCanvas } from "@/tools/image/_shared/image";

type PdfJsDoc = Awaited<ReturnType<typeof import("./pdf").openPdfForRender>>;

/**
 * Render one page (1-based) to a canvas at the given DPI on a white background.
 * Returns the canvas plus the page size in PDF points (1/72 inch).
 */
export async function renderPage(doc: PdfJsDoc, pageNumber: number, dpi: number) {
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  let scale = dpi / 72;
  const fit = clampToCanvasLimit(Math.ceil(base.width * scale), Math.ceil(base.height * scale));
  if (fit.scaled) scale = fit.w / base.width;
  const viewport = page.getViewport({ scale });
  const { canvas, ctx } = createCanvas(viewport.width, viewport.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  page.cleanup();
  return { canvas, widthPt: base.width, heightPt: base.height };
}

/** Release a canvas' memory right away (important on iPhones with many pages). */
export function freeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}
