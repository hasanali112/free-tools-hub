/**
 * Shared geometry for the AIToolkitFree "A" logo mark (48×48).
 * Used by the React logo, favicon, Apple touch icon and OG images — change it here only.
 */
export const LOGO = {
  // Gradient runs from electric blue (left leg) to violet (right leg).
  from: "#2F7BFF",
  to: "#5B21D6",
  // Bold geometric "A" (apex top-center, open bottom).
  a: "M20.6 6.2c1.5-2.9 5.3-2.9 6.8 0l16.2 31.6c1.3 2.6-.5 5.7-3.4 5.7h-3.1c-1.4 0-2.7-.8-3.4-2.1L24 19.6 14.3 41.4c-.6 1.3-1.9 2.1-3.4 2.1H7.8c-2.9 0-4.7-3.1-3.4-5.7Z",
  // Crossbar that turns the Λ into an A.
  bar: "M15.6 33.2h14.1c1.3 0 2.2 1.4 1.6 2.6l-.9 1.9c-.4.9-1.3 1.4-2.2 1.4H13.4c-1.3 0-2.2-1.4-1.6-2.6l.9-1.9c.6-.9 1.5-1.4 2.9-1.4Z",
} as const;

const svg = (bg?: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="4" y1="40" x2="44" y2="8" gradientUnits="userSpaceOnUse"><stop stop-color="${LOGO.from}"/><stop offset="1" stop-color="${LOGO.to}"/></linearGradient></defs>${
    bg ? `<rect width="48" height="48" rx="11" fill="${bg}"/><g transform="translate(6.5 6) scale(.73)">` : "<g>"
  }<path d="${LOGO.a}" fill="url(#g)"/><path d="${LOGO.bar}" fill="url(#g)" opacity=".85"/></g></svg>`;

/** Transparent "A" (favicon). */
export const LOGO_SVG = svg();
/** "A" on a white rounded tile (Apple touch icon, dark backgrounds). */
export const LOGO_TILE_SVG = svg("#ffffff");
