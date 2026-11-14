import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "compress-pdf",
  category: "pdf",
  path: "/pdf/compress",
  name: "Compress PDF",
  h1: "Compress PDF — Reduce PDF File Size for Free",
  title: "Compress PDF Online — Reduce PDF Size Free, No Upload",
  description:
    "Make PDF files smaller for email and online forms. Free PDF compressor with three levels that runs in your browser — your files are never uploaded.",
  summary: "Shrink large PDFs, such as scans, so they fit email and upload limits.",
  keywords: ["compress", "reduce", "shrink", "smaller", "pdf", "size", "mb", "email", "scan"],
  howTo: [
    "Drop your PDF files into the box, or tap to choose them.",
    "Pick a level: Light keeps text selectable, Recommended and Strong give much smaller files.",
    "Press Compress and download the smaller PDF.",
  ],
  faqs: [
    {
      q: "Which compression level should I choose?",
      a: "For scanned documents and PDFs full of photos, “Recommended” usually cuts the size by 50–90%. If you need to keep the text selectable and searchable, use “Light”. “Strong” gives the smallest files, best for viewing on screen.",
    },
    {
      q: "Why can't I select text after compressing?",
      a: "The Recommended and Strong levels turn each page into an optimized image, which is what makes the file so much smaller. Use the Light level if selectable text matters.",
    },
    {
      q: "Is my PDF uploaded?",
      a: "No. Compression runs entirely in your browser, so your document never leaves your device.",
    },
    {
      q: "What if the file doesn't get smaller?",
      a: "Some PDFs are already well optimized. If compression can't make the file smaller, the tool keeps your original so you never end up with a bigger file.",
    },
    {
      q: "Can I compress several PDFs at once?",
      a: "Yes. Add as many PDFs as you like and download them one by one or together as a ZIP.",
    },
  ],
  related: ["merge-pdf", "split-pdf", "compress", "jpg-to-pdf"],
};
