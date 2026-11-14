import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "jpg-to-png",
  category: "image",
  path: "/image/jpg-to-png",
  name: "JPG to PNG",
  h1: "JPG to PNG Converter — Free, No Upload",
  title: "JPG to PNG Converter — Free, Batch, No Upload",
  description:
    "Convert JPG and JPEG images to lossless PNG for free. Batch convert right in your browser with no upload and download all files as a ZIP.",
  summary: "Convert JPG photos to lossless PNG images.",
  keywords: ["jpg", "jpeg", "png", "convert", "lossless"],
  howTo: [
    "Drop your JPG or JPEG files into the box, or tap to choose them.",
    "Press Convert.",
    "Download each PNG, or all of them as a ZIP file.",
  ],
  faqs: [
    {
      q: "Will converting to PNG improve quality?",
      a: "No. PNG keeps the image exactly as it is now, but it can't restore detail that JPG compression already removed. It is useful when you need to edit the image further without losing more quality.",
    },
    {
      q: "Does the PNG get a transparent background?",
      a: "No. JPG has no transparency, so the PNG has the same solid background as the original photo.",
    },
    {
      q: "Why is the PNG file larger?",
      a: "PNG is lossless, so it stores more data than JPG. That is expected.",
    },
    {
      q: "Are my files uploaded?",
      a: "No. Everything runs in your browser and your images never leave your device.",
    },
  ],
  related: ["png-to-jpg", "heic-to-png", "compress", "resize"],
};
