"use client";

import { useEffect, useRef } from "react";
import { injectScript, whenIdle } from "@/lib/idle";

/** Adsterra Native Banner. The script is injected only after the page is loaded and idle. */
export function AdsterraNative({ src, containerId }: { src: string; containerId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return whenIdle(() => {
      injectScript(src, el, { "data-cfasync": "false" });
    });
  }, [src]);
  return (
    <div ref={ref}>
      <div id={containerId} />
    </div>
  );
}
