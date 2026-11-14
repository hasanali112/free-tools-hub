import { ImageResponse } from "next/og";
import { LOGO_TILE_SVG } from "@/components/brand/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(LOGO_TILE_SVG).toString("base64")}`;
  return new ImageResponse(
    <img src={src} width={180} height={180} alt="" />,
    size,
  );
}
