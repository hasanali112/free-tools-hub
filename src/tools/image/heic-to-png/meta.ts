import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "heic-to-png",
  category: "image",
  path: "/image/heic-to-png",
  name: "HEIC to PNG",
  h1: "HEIC to PNG Converter — Free, No Upload",
  title: "HEIC to PNG Converter — Free, Lossless, No Upload",
  description:
    "Convert HEIC and HEIF photos to lossless PNG images for free. Batch convert in your browser with no upload and download everything as a ZIP.",
  summary: "Convert iPhone HEIC photos to lossless PNG images.",
  keywords: ["heic", "heif", "png", "lossless", "iphone photo", "convert"],
  howTo: [
    "Drop your HEIC or HEIF photos into the box, or tap to choose them.",
    "Make sure PNG is selected, then press Convert.",
    "Download each PNG, or grab them all as a ZIP file.",
  ],
  faqs: [
    {
      q: "Is HEIC to PNG lossless?",
      a: "Yes. PNG is a lossless format, so the converted image keeps every pixel of the decoded photo. PNG files are larger than JPG, so pick JPG if file size matters more.",
    },
    {
      q: "Are my files uploaded anywhere?",
      a: "No. Everything happens inside your browser. Your photos are never sent to a server.",
    },
    {
      q: "Why are PNG files bigger than the HEIC original?",
      a: "HEIC uses very efficient modern compression. PNG stores the image without losing detail, which takes more space. That is normal.",
    },
    {
      q: "Can I convert Live Photos?",
      a: "The still image of a Live Photo is a HEIC file and converts fine. The short video part is not included.",
    },
  ],
  related: ["heic-to-jpg", "jpg-to-png", "compress", "remove-metadata"],
};
