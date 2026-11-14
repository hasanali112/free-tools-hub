import { ogImage, ogSize } from "@/lib/og";
import { getTool } from "@/tools/registry";

const tool = getTool("overtime");

export const alt = tool.h1;
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({ title: tool.name, subtitle: tool.summary, badge: "Free calculator" });
}
