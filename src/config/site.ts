/** Site-wide settings. Change the name/URL here (or via env vars) and it updates everywhere. */
export const site = {
  name: "AIToolkitFree",
  tagline: "Free online tools that run right in your browser",
  description:
    "Free, fast online tools for images, PDFs, video and everyday math. Everything runs in your browser — your files never leave your device.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://aitoolkitfree.com").replace(/\/$/, ""),
  contactEmail: "contact@aitoolkitfree.com",
  /** Google Tag Manager container (public ID). Add GA4 and other tags inside GTM. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WK494TRS",
  /** Optional direct GA4 (leave empty when GA4 is configured inside GTM, to avoid double counting). */
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
} as const;

export function absoluteUrl(path = "/") {
  return path === "/" ? site.url : `${site.url}${path}`;
}
