/**
 * Central ad configuration. The whole site renders ads through <AdSlot/> and <AdScripts/>,
 * so switching networks (e.g. Adsterra -> AdSense) only touches this file and AdSlot.tsx.
 */
export type AdNetwork = "none" | "adsterra" | "adsense";
export type AdSlotName = "below-tool" | "in-content";

const env = (v: string | undefined) => (v || "").trim();

export const ads = {
  /** Master switch. Set to "none" to turn every ad off site-wide. */
  network: "adsterra" as AdNetwork,

  adsterra: {
    slots: {
      "below-tool": {
        src: env(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC),
        containerId: env(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER),
      },
      "in-content": {
        src: env(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE2_SRC),
        containerId: env(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE2_CONTAINER),
      },
    } satisfies Record<AdSlotName, { src: string; containerId: string }>,
    socialBarSrc: env(process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC),
  },

  /** Paths where ads are never shown (exact match). Per-tool switch: `ads: false` in the tool's meta. */
  disabledPaths: ["/privacy", "/terms", "/contact", "/about"] as string[],

  /** Show grey placeholder boxes in `next dev` when a slot has no ad code configured. */
  showPlaceholdersInDev: true,
};
