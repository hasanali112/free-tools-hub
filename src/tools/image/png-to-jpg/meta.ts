import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "png-to-jpg",
  category: "image",
  path: "/image/png-to-jpg",
  name: "PNG to JPG",
  h1: "PNG to JPG Converter — Free, No Upload",
  title: "PNG to JPG Converter — Free, Batch, No Upload",
  description:
    "Convert PNG images to JPG for free. Choose quality and background color for transparent areas. Batch convert in your browser, download as ZIP.",
  summary: "Convert PNG to smaller JPG files, with a background for transparency.",
  keywords: ["png", "jpg", "jpeg", "convert", "transparent", "smaller"],
  howTo: [
    "Drop your PNG files into the box, or tap to choose them.",
    "Choose JPG quality and the background color for transparent parts.",
    "Press Convert and download your JPGs, one by one or as a ZIP.",
  ],
  faqs: [
    {
      q: "What happens to transparent areas?",
      a: "JPG doesn't support transparency, so transparent pixels are filled with the background color you pick (white by default).",
    },
    {
      q: "Why convert PNG to JPG?",
      a: "JPG files are usually much smaller for photos, which makes them faster to upload, email and share.",
    },
    {
      q: "Are my files uploaded?",
      a: "No. The conversion happens in your browser and nothing is sent to a server.",
    },
    {
      q: "Is there a file limit?",
      a: "There is no fixed limit. Very large images use more memory, so on older phones convert a few at a time.",
    },
  ],
  related: ["jpg-to-png", "compress", "webp-to-jpg", "jpg-to-pdf"],
};
