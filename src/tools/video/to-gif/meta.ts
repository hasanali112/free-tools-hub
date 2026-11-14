import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "video-to-gif",
  category: "video",
  path: "/video/to-gif",
  name: "Video to GIF",
  h1: "Video to GIF Converter — Free, No Upload",
  title: "Video to GIF Converter — MP4 & MOV to GIF, Free, No Upload",
  description:
    "Turn MP4, MOV and WebM clips into high-quality animated GIFs. Pick the start time, length, size and frame rate. Free and private — runs in your browser.",
  summary: "Turn a short clip from any video into an animated GIF.",
  keywords: ["gif", "video to gif", "mp4 to gif", "mov to gif", "animated", "meme", "clip"],
  howTo: [
    "Drop your video into the box, or tap to choose it.",
    "Set where the GIF should start and how long it should be, then pick the size and frame rate.",
    "Press Make GIF and download your animated GIF.",
  ],
  faqs: [
    {
      q: "How do I make a GIF from part of a video?",
      a: "Enter the start time (in seconds) and the length. For example, start 12 and length 4 makes a 4-second GIF from 0:12 to 0:16.",
    },
    {
      q: "How can I make my GIF smaller?",
      a: "GIFs get big quickly. Use a shorter length (2–6 seconds), Small or Medium width and 8–12 fps for files that are easy to share.",
    },
    {
      q: "Is my video uploaded?",
      a: "No. The GIF is created in your browser and your video never leaves your device.",
    },
    {
      q: "Why do GIF colors look different from the video?",
      a: "GIFs can only show 256 colors per frame. We build a custom color palette for each clip to keep colors as close as possible, but very colorful scenes may show slight banding.",
    },
  ],
  related: ["mov-to-mp4", "video-compress", "compress", "resize"],
};
