import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "mov-to-mp4",
  category: "video",
  path: "/video/mov-to-mp4",
  name: "MOV to MP4",
  h1: "MOV to MP4 Converter — Free, No Upload",
  title: "MOV to MP4 Converter — Free, Private, No Upload",
  description:
    "Convert iPhone and QuickTime MOV videos to MP4 for free. Fast lossless conversion when possible, H.264 for full compatibility. Runs in your browser — no upload.",
  summary: "Turn iPhone and QuickTime MOV videos into MP4 that plays everywhere.",
  keywords: ["mov", "mp4", "quicktime", "iphone video", "convert", "hevc", "h264", "video"],
  howTo: [
    "Drop your MOV videos into the box, or tap to choose them.",
    "Keep “Auto” (recommended) or choose Fast copy or Most compatible.",
    "Press Convert and download your MP4 files.",
  ],
  faqs: [
    {
      q: "Is my video uploaded?",
      a: "No. The conversion runs inside your browser using WebAssembly. Your videos never leave your device.",
    },
    {
      q: "Will I lose quality?",
      a: "Usually not. If your MOV already uses H.264, the video is copied into an MP4 container without re-encoding — identical quality in seconds. HEVC videos are re-encoded at high quality so they play everywhere.",
    },
    {
      q: "Why won't my iPhone video play on Windows?",
      a: "iPhones record in HEVC (H.265) by default, which many Windows PCs and websites can't play. “Auto” or “Most compatible” converts it to H.264, which plays on every device.",
    },
    {
      q: "How long does it take?",
      a: "Fast copy takes seconds. Re-encoding runs on your device, so a 1-minute 1080p video may take a few minutes on a laptop and longer on a phone.",
    },
    {
      q: "Is there a size limit?",
      a: "Files up to 2 GB can be processed, but very long or 4K videos need a lot of memory. On phones, shorter clips work best.",
    },
  ],
  related: ["video-compress", "video-to-gif", "heic-to-jpg", "compress-pdf"],
};
