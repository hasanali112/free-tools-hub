import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "pdf-to-jpg",
  category: "pdf",
  path: "/pdf/pdf-to-jpg",
  name: "PDF to JPG",
  h1: "PDF to JPG Converter — Free, No Upload",
  title: "PDF to JPG Converter — Convert PDF Pages to Images, Free",
  description:
    "Convert every page of a PDF to a high-quality JPG or PNG image, at up to 300 DPI. Free, private and fast — runs in your browser with no upload.",
  summary: "Turn each PDF page into a JPG or PNG image.",
  keywords: ["pdf", "jpg", "jpeg", "png", "image", "convert", "pages", "picture"],
  howTo: [
    "Drop your PDF into the box, or tap to choose it.",
    "Choose the resolution (72, 150 or 300 DPI), JPG or PNG, and optionally which pages.",
    "Press Convert and download each image, or all pages as a ZIP.",
  ],
  faqs: [
    {
      q: "What resolution should I pick?",
      a: "150 DPI looks sharp on phones and computer screens. Choose 300 DPI if you plan to print the images, and 72 DPI for the smallest files.",
    },
    {
      q: "Can I convert only some pages?",
      a: "Yes. Type the pages you want in the Pages box, for example “1, 3-5”. Leave it empty to convert every page.",
    },
    {
      q: "Is my PDF uploaded?",
      a: "No. Pages are rendered into images in your browser, so the PDF never leaves your device.",
    },
    {
      q: "JPG or PNG — which is better?",
      a: "JPG files are much smaller and work everywhere. PNG is lossless and keeps text and lines perfectly crisp, but the files are bigger.",
    },
  ],
  related: ["jpg-to-pdf", "split-pdf", "compress", "compress-pdf"],
};
