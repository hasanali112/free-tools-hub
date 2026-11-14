import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "webp-to-jpg",
  category: "image",
  path: "/image/webp-to-jpg",
  name: "WebP to JPG",
  h1: "WebP to JPG Converter — Free, No Upload",
  title: "WebP to JPG Converter — Free, Batch, No Upload",
  description:
    "Convert WebP images to JPG (or PNG) for free. Batch convert in your browser — no upload, no sign-up — and download everything as a ZIP.",
  summary: "Turn WebP images from websites into normal JPG files.",
  keywords: ["webp", "jpg", "jpeg", "png", "convert", "google"],
  howTo: [
    "Drop your WebP files into the box, or tap to choose them.",
    "Choose JPG or PNG and the quality, then press Convert.",
    "Download each image, or all of them as a ZIP file.",
  ],
  faqs: [
    {
      q: "What is a WebP file?",
      a: "WebP is an image format made by Google that many websites use to load faster. Some older apps and editors can't open it, so converting to JPG makes the image easier to use.",
    },
    {
      q: "Are animated WebP files supported?",
      a: "Animated WebP files are converted to a still JPG of the first frame.",
    },
    {
      q: "What about transparent WebP images?",
      a: "Transparent areas are filled with the background color you choose. Pick PNG instead if you want to keep transparency.",
    },
    {
      q: "Are my files uploaded?",
      a: "No. The conversion happens in your browser and your images never leave your device.",
    },
  ],
  related: ["png-to-jpg", "compress", "jpg-to-png", "heic-to-jpg"],
};
