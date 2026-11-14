import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph image design (1200×630), rendered at build time. */
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
          padding: "72px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #0ea5e9 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "white",
              color: "#2563eb",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            FT
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {badge && (
            <div style={{ display: "flex", fontSize: 28, opacity: 0.85, textTransform: "uppercase", letterSpacing: 2 }}>{badge}</div>
          )}
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 34, opacity: 0.92 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>Free · No upload · Your files never leave your device</div>
      </div>
    ),
    ogSize,
  );
}
