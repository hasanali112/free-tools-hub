export type Fit = "crop" | "fit" | "stretch";

export interface Preset {
  id: string;
  label: string;
  group: string;
  width: number;
  height: number;
  /** Max output size in KB (e.g. DV lottery = 240KB). */
  maxKB?: number;
  hint?: string;
}

/** Add new presets here — they appear in the dropdown automatically. */
export const PRESETS: Preset[] = [
  { id: "us-passport", group: "Official photos", label: "US Passport 2x2 (600×600)", width: 600, height: 600, hint: "2×2 inch square JPG for online passport renewal. Keep your head centered." },
  { id: "dv-lottery", group: "Official photos", label: "DV Lottery / Green Card (600×600, ≤240KB)", width: 600, height: 600, maxKB: 240, hint: "Square 600×600 JPEG under 240KB, as required for the Diversity Visa entry." },
  { id: "ig-square", group: "Instagram", label: "Instagram post square (1080×1080)", width: 1080, height: 1080 },
  { id: "ig-portrait", group: "Instagram", label: "Instagram post portrait (1080×1350)", width: 1080, height: 1350 },
  { id: "ig-story", group: "Instagram", label: "Instagram story / Reel (1080×1920)", width: 1080, height: 1920 },
  { id: "li-profile", group: "LinkedIn", label: "LinkedIn profile photo (400×400)", width: 400, height: 400 },
  { id: "li-banner", group: "LinkedIn", label: "LinkedIn banner (1584×396)", width: 1584, height: 396 },
  { id: "li-post", group: "LinkedIn", label: "LinkedIn post (1200×627)", width: 1200, height: 627 },
  { id: "yt-thumb", group: "YouTube", label: "YouTube thumbnail (1280×720)", width: 1280, height: 720 },
];
