import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/config/site";

export const alt = `${site.name} — free online tools`;
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({ title: "Free Online Tools", subtitle: "Images, PDFs, video & calculators — right in your browser" });
}
