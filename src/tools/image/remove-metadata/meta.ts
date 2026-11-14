import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "remove-metadata",
  category: "image",
  path: "/image/remove-metadata",
  name: "Remove Photo Metadata",
  h1: "Remove EXIF & GPS Location from Photos — Free",
  title: "Remove EXIF Data & GPS Location from Photos — Free, No Upload",
  description:
    "Strip GPS location, camera details and other EXIF metadata from JPG, PNG and WebP photos before you share them. Free, private, no upload.",
  summary: "Strip hidden GPS location and camera data before you share photos.",
  keywords: ["exif", "metadata", "gps", "location", "privacy", "strip", "remove", "geotag"],
  howTo: [
    "Drop your photos into the box, or tap to choose them.",
    "Press Remove metadata. The tool shows which photos contained GPS location.",
    "Download the clean photos, one by one or as a ZIP.",
  ],
  faqs: [
    {
      q: "What is EXIF metadata?",
      a: "EXIF is hidden information stored inside photos: the camera or phone model, date and time, settings, and often the exact GPS location where the photo was taken.",
    },
    {
      q: "Why remove GPS location from photos?",
      a: "If you post or send a photo with GPS data, anyone who downloads the original file can see where it was taken — for example your home address. Removing it protects your privacy.",
    },
    {
      q: "Does removing metadata reduce quality?",
      a: "For most JPG and PNG files the image data is not touched at all — only the metadata blocks are removed, so quality is identical. Rotated JPGs and other formats are re-saved at high quality so they still display the right way up.",
    },
    {
      q: "Are my photos uploaded?",
      a: "No. The metadata is removed in your browser. Your photos never leave your device.",
    },
    {
      q: "Do social networks remove location data?",
      a: "Many large networks strip it on upload, but email, messaging apps that send “original quality” files, cloud links and many websites do not. Cleaning photos yourself is the safe option.",
    },
  ],
  related: ["compress", "heic-to-jpg", "resize", "png-to-jpg"],
};
