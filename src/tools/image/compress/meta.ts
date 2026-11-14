import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "compress",
  category: "image",
  path: "/image/compress",
  name: "Compress Image",
  h1: "Compress Image to 100KB, 200KB or 500KB — Free",
  title: "Compress Image to 100KB, 200KB, 500KB — Free, No Upload",
  description:
    "Reduce JPG, PNG and WebP file size to 100KB, 200KB, 500KB or any size. Free batch image compressor that runs in your browser with no upload.",
  summary: "Shrink photos to a target size like 100KB for forms and uploads.",
  keywords: ["compress", "reduce size", "kb", "shrink", "optimize", "jpeg", "png", "100kb", "200kb", "500kb"],
  howTo: [
    "Drop your images into the box, or tap to choose them.",
    "Pick a target size such as 100KB, 200KB or 500KB, or set a custom quality.",
    "Press Compress and download your smaller images, one by one or as a ZIP.",
  ],
  faqs: [
    {
      q: "How do I compress an image to 100KB?",
      a: "Choose the “100KB” preset and press Compress. The tool lowers the quality and, if needed, the pixel size step by step until the file is at or under 100KB.",
    },
    {
      q: "Are my images uploaded?",
      a: "No. Compression runs locally in your browser. Your images never leave your device.",
    },
    {
      q: "Which formats are supported?",
      a: "JPG, PNG and WebP. You can keep the original format or convert to JPG or WebP, which usually gives much smaller files than PNG.",
    },
    {
      q: "Why is my PNG still large?",
      a: "PNG is lossless, so it can't shrink as much as JPG. For photos, set the output format to JPG to reach small target sizes like 100KB more easily.",
    },
    {
      q: "Will the image dimensions change?",
      a: "Only if the target size can't be reached by lowering quality alone. In that case the image is scaled down a little until it fits.",
    },
  ],
  related: ["resize", "heic-to-jpg", "compress-pdf", "remove-metadata"],
};
