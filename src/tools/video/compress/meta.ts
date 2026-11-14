import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "video-compress",
  category: "video",
  path: "/video/compress",
  name: "Compress Video",
  h1: "Compress Video — Reduce Video File Size for Free",
  title: "Compress Video Online — Reduce MP4 & MOV Size, Free, No Upload",
  description:
    "Make videos smaller for email, Discord, WhatsApp and uploads. Compress MP4, MOV and more to 720p, 480p or a target size like 25 MB. No upload needed.",
  summary: "Shrink big videos for email, messaging and upload limits.",
  keywords: ["compress", "video", "reduce size", "mp4", "mov", "smaller", "mb", "discord", "email", "whatsapp", "25mb"],
  howTo: [
    "Drop your videos into the box, or tap to choose them.",
    "Choose a level (Recommended is 720p) or set a target size such as 25 MB.",
    "Press Compress and download the smaller MP4.",
  ],
  faqs: [
    {
      q: "How do I compress a video to 25 MB?",
      a: "Choose “Target size”, enter 25 MB and press Compress. The tool calculates the right bitrate from the video's length. Very long videos may need a bigger target to look good.",
    },
    {
      q: "Is my video uploaded?",
      a: "No. Compression happens in your browser, so your video never leaves your device.",
    },
    {
      q: "Which level should I choose?",
      a: "“Recommended” (up to 720p) gives big savings and still looks sharp on phones. “Strong” (480p) is best for messaging. “Light” keeps the original resolution.",
    },
    {
      q: "What format is the result?",
      a: "An MP4 file with H.264 video and AAC audio, which plays on iPhone, Android, Windows, Mac and all major websites.",
    },
    {
      q: "Why does it take a while?",
      a: "Video compression is heavy work and runs on your own device rather than a server. Keep the tab open; a few minutes per minute of HD video is normal.",
    },
  ],
  related: ["mov-to-mp4", "video-to-gif", "compress", "compress-pdf"],
};
