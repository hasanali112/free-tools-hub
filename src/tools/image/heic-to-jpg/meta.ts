import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "heic-to-jpg",
  category: "image",
  path: "/image/heic-to-jpg",
  name: "HEIC to JPG",
  h1: "HEIC to JPG Converter — Free, No Upload",
  title: "HEIC to JPG Converter — Free, No Upload, Batch",
  description:
    "Convert iPhone HEIC photos to JPG for free. Batch convert and download as ZIP. Works in your browser — your photos never leave your device.",
  summary: "Turn iPhone HEIC photos into JPG files that open everywhere.",
  keywords: ["heic", "heif", "iphone photo", "convert", "jpeg", "apple"],
  howTo: [
    "Drop your HEIC or HEIF photos into the box, or tap to choose them from your phone or computer.",
    "Pick JPG (or PNG) and the quality you want, then press Convert.",
    "Download each photo, or download them all at once as a ZIP file.",
  ],
  faqs: [
    {
      q: "Are my photos uploaded to a server?",
      a: "No. The conversion runs entirely in your web browser using JavaScript. Your photos never leave your device, so this works even for private pictures.",
    },
    {
      q: "What is a HEIC file?",
      a: "HEIC (High Efficiency Image Container) is the default photo format on iPhones and iPads since iOS 11. It saves space, but many Windows PCs, websites and apps still can't open it, which is why converting to JPG is useful.",
    },
    {
      q: "Can I convert many HEIC files at once?",
      a: "Yes. Select or drop as many photos as you like. They are converted one after another and you can download them all together as a single ZIP file.",
    },
    {
      q: "Will I lose image quality?",
      a: "JPG uses lossy compression, but at the default 92% quality the difference is not visible for normal photos. Choose 100% for maximum quality or PNG if you need a lossless file.",
    },
    {
      q: "Does it work on iPhone?",
      a: "Yes. Open this page in Safari or Chrome on your iPhone, tap the upload box and choose photos from your library. Converted files can be saved to Files or Photos.",
    },
  ],
  related: ["heic-to-png", "compress", "jpg-to-pdf", "remove-metadata"],
};
