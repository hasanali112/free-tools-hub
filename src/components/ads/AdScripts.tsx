"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ads } from "@/config/ads";
import { injectScript, whenIdle } from "@/lib/idle";

/** Site-wide ad scripts (Adsterra Social Bar). Loaded once, after the page is interactive and idle. */
export function AdScripts({ disabledPaths = [] }: { disabledPaths?: string[] }) {
  const pathname = usePathname();
  const off =
    ads.network !== "adsterra" ||
    !ads.adsterra.socialBarSrc ||
    ads.disabledPaths.includes(pathname) ||
    disabledPaths.includes(pathname);

  useEffect(() => {
    if (off || document.querySelector("script[data-ad='socialbar']")) return;
    return whenIdle(() => {
      injectScript(ads.adsterra.socialBarSrc, document.body, { "data-ad": "socialbar", "data-cfasync": "false" });
    });
  }, [off]);

  return null;
}
