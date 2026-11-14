/** Shared geometry for the AIToolkitFree logo mark (48×48), used by the React logo, favicon and OG images. */
export const LOGO = {
  from: "#4F46E5",
  to: "#7C3AED",
  accent: "#67E8F9",
  // Large 4-point "AI spark"
  spark: "M21 10.5c1.25 8.2 4.3 11.25 12.5 12.5-8.2 1.25-11.25 4.3-12.5 12.5C19.75 27.3 16.7 24.25 8.5 23c8.2-1.25 11.25-4.3 12.5-12.5Z",
  // Small cyan spark
  mini: "M35.5 7.5c.55 3.6 1.9 4.95 5.5 5.5-3.6.55-4.95 1.9-5.5 5.5-.55-3.6-1.9-4.95-5.5-5.5 3.6-.55 4.95-1.9 5.5-5.5Z",
  // Toolkit base (rounded bar)
  bar: { x: 28.5, y: 33, w: 11, h: 4.5, r: 2.25 },
} as const;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="${LOGO.from}"/><stop offset="1" stop-color="${LOGO.to}"/></linearGradient></defs><rect width="48" height="48" rx="13" fill="url(#g)"/><path d="${LOGO.spark}" fill="#fff"/><path d="${LOGO.mini}" fill="${LOGO.accent}"/><rect x="${LOGO.bar.x}" y="${LOGO.bar.y}" width="${LOGO.bar.w}" height="${LOGO.bar.h}" rx="${LOGO.bar.r}" fill="#fff" fill-opacity=".55"/></svg>`;
