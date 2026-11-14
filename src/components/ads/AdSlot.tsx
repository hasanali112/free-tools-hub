import { ads, type AdSlotName } from "@/config/ads";
import { AdsterraNative } from "./AdsterraNative";

/**
 * The one place the site renders an in-page ad. Swap networks here (and in config/ads.ts).
 * Ads are always placed outside the tool area and never overlay it.
 */
export function AdSlot({ name, path, enabled = true }: { name: AdSlotName; path: string; enabled?: boolean }) {
  if (!enabled || ads.network === "none" || ads.disabledPaths.includes(path)) return null;

  if (ads.network === "adsterra") {
    const slot = ads.adsterra.slots[name];
    if (slot.src && slot.containerId) {
      return (
        <Frame>
          <AdsterraNative src={slot.src} containerId={slot.containerId} />
        </Frame>
      );
    }
  }

  // AdSense: add an <AdsenseUnit/> branch here when approved.

  if (process.env.NODE_ENV === "development" && ads.showPlaceholdersInDev) {
    return (
      <Frame>
        <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-400">
          Ad slot “{name}” — set ad code in .env to enable
        </div>
      </Frame>
    );
  }
  return null;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <aside aria-label="Advertisement" className="my-8">
      <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-slate-400">Advertisement</p>
      <div className="min-h-[120px]">{children}</div>
    </aside>
  );
}
