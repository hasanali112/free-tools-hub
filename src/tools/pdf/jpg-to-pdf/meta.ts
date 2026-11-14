import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "jpg-to-pdf",
  category: "pdf",
  path: "/pdf/jpg-to-pdf",
  name: "JPG to PDF",
  h1: "JPG to PDF Converter — Free, No Upload",
  title: "JPG to PDF Converter — Combine Images into One PDF, Free",
  description:
    "Convert JPG, PNG, HEIC and WebP images to PDF for free. Combine many photos into one PDF in any order, US Letter or A4. No upload — runs in your browser.",
  summary: "Turn photos and scans into one PDF, in the order you choose.",
  keywords: ["jpg", "jpeg", "png", "image", "photo", "pdf", "combine", "scan", "heic", "convert"],
  howTo: [
    "Drop your images into the box, or tap to choose them from your phone or computer.",
    "Put them in the right order with the arrows, and pick the page size (US Letter, A4 or same as image).",
    "Press Convert and download your PDF.",
  ],
  faqs: [
    {
      q: "How do I combine several JPGs into one PDF?",
      a: "Add all the images, arrange them with the up and down arrows (or press “Sort by name”), keep “One PDF with all images” selected and press Convert. Each image becomes one page.",
    },
    {
      q: "Are my images uploaded?",
      a: "No. The PDF is created inside your browser. Your images never leave your device, which makes this safe for IDs, receipts and other private documents.",
    },
    {
      q: "Does converting reduce image quality?",
      a: "No. JPG and PNG images are placed into the PDF unchanged. Only HEIC, WebP and sideways-rotated photos are re-saved as high-quality JPG first so they display correctly.",
    },
    {
      q: "Which page size should I choose?",
      a: "US Letter (8.5 × 11 in) is standard in the United States. A4 is used in most other countries. “Same as image” makes each page exactly the size of its photo, with no white borders when the margin is set to None.",
    },
    {
      q: "Can I convert iPhone photos (HEIC) to PDF?",
      a: "Yes. HEIC photos are supported directly — there's no need to convert them to JPG first.",
    },
  ],
  related: ["merge-pdf", "compress-pdf", "heic-to-jpg", "pdf-to-jpg"],
};
