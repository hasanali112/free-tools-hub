import { ImageResponse } from "next/og";
import { LOGO_TILE_SVG } from "@/components/brand/logo-paths";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

const logoSrc = `data:image/svg+xml;base64,${Buffer.from(LOGO_TILE_SVG).toString("base64")}`;

/** Shared Open Graph image (1200×630) in the AIToolkitFree brand, rendered at build time. */
export function ogImage({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          background: "linear-gradient(135deg, #231753 0%, #3a2885 45%, #5435cf 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(34,211,238,0) 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 38, fontWeight: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" />
          <div style={{ display: "flex" }}>
            <span>AIToolkit</span>
            <span style={{ color: "#67e8f9", marginLeft: -9 }}>Free</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {badge && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 24,
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                color: "#c7f9ff",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {badge}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#d9d1ff", maxWidth: 1000 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#bdaeff" }}>
          {site.url.replace(/^https?:\/\//, "")} · Free · No upload · Private
        </div>
      </div>
    ),
    ogSize,
  );
}
