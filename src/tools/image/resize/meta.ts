import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "resize",
  category: "image",
  path: "/image/resize",
  name: "Resize Image",
  h1: "Resize Image — Passport 2x2, Instagram, YouTube & More",
  title: "Resize Image Online — Passport 2x2, DV Lottery, Instagram, YouTube",
  description:
    "Resize photos to exact pixels or presets: US passport 2x2, DV lottery, Instagram, LinkedIn and YouTube thumbnail. Free, batch, no upload.",
  summary: "Resize to exact pixels or one-click presets for passports and social media.",
  keywords: [
    "resize",
    "dimensions",
    "pixels",
    "passport photo",
    "2x2",
    "dv lottery",
    "green card",
    "instagram",
    "linkedin",
    "youtube thumbnail",
    "crop",
  ],
  howTo: [
    "Drop your images into the box, or tap to choose them.",
    "Pick a preset (US passport, DV lottery, Instagram, LinkedIn, YouTube) or type your own width and height.",
    "Press Resize and download the result, or all files as a ZIP.",
  ],
  faqs: [
    {
      q: "What size is a US passport photo in pixels?",
      a: "A US passport photo is 2 × 2 inches. For digital submissions the State Department asks for a square image between 600 × 600 and 1200 × 1200 pixels. The “US Passport 2x2” preset makes a 600 × 600 JPG.",
    },
    {
      q: "What are the DV lottery photo requirements?",
      a: "The Diversity Visa photo must be a square JPEG, 600 × 600 pixels, and 240KB or smaller. The DV Lottery preset creates exactly that and keeps the file under 240KB. Your head should be centered and fill about 50–69% of the height, so frame your photo before cropping.",
    },
    {
      q: "Does the tool crop my photo?",
      a: "With “Crop to fill” (used by presets) the image is scaled and the edges are trimmed so it fills the exact size from the center. Choose “Fit inside” to keep the whole image and add a white border, or “Stretch” to force the size.",
    },
    {
      q: "What size is a YouTube thumbnail?",
      a: "1280 × 720 pixels (16:9). The YouTube preset produces exactly that size.",
    },
    {
      q: "Are my photos uploaded?",
      a: "No. Resizing happens in your browser. Your images never leave your device.",
    },
    {
      q: "Does this make a photo officially compliant?",
      a: "It sets the correct size and format. You are still responsible for lighting, background, expression and head position that the official rules require.",
    },
  ],
  related: ["compress", "heic-to-jpg", "remove-metadata", "png-to-jpg"],
};
