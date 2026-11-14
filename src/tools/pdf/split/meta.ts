import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "split-pdf",
  category: "pdf",
  path: "/pdf/split",
  name: "Split PDF",
  h1: "Split PDF — Extract Pages for Free, No Upload",
  title: "Split PDF Online — Extract Pages from PDF, Free, No Upload",
  description:
    "Split a PDF into single pages or page ranges, or extract just the pages you need. Free, fast and private — runs in your browser with no upload.",
  summary: "Split a PDF into pages or ranges, or pull out just the pages you need.",
  keywords: ["split", "extract", "separate", "pages", "pdf", "cut", "remove pages"],
  howTo: [
    "Drop your PDF into the box, or tap to choose it.",
    "Choose to split every page, split by ranges (like 1-3, 4-6), or extract certain pages into one new PDF.",
    "Press Split and download each file, or all of them as a ZIP.",
  ],
  faqs: [
    {
      q: "How do I extract certain pages from a PDF?",
      a: "Choose “Extract pages”, type the pages you want (for example 2, 5-7), and press Split. You get one new PDF with only those pages.",
    },
    {
      q: "How do I write page ranges?",
      a: "Separate ranges with commas: “1-3, 5, 8-10”. A range with no end, like “8-”, means page 8 to the last page.",
    },
    {
      q: "Is my PDF uploaded?",
      a: "No. Splitting happens in your browser and your PDF never leaves your device.",
    },
    {
      q: "Does splitting lower the quality?",
      a: "No. Pages are copied exactly as they are; text stays selectable and images are unchanged.",
    },
  ],
  related: ["merge-pdf", "pdf-to-jpg", "compress-pdf", "jpg-to-pdf"],
};
