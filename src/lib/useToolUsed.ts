"use client";

import { useRef } from "react";
import { track } from "./analytics";

/** Returns a function that sends the GA4 `tool_used` event once per page view (call it on first input). */
export function useToolUsed(tool: string) {
  const sent = useRef(false);
  return () => {
    if (sent.current) return;
    sent.current = true;
    track("tool_used", { tool_name: tool });
  };
}
