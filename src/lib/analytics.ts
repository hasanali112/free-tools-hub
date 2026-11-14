/**
 * Analytics events. Every event is pushed to the GTM dataLayer (create GTM triggers on the event names),
 * and also sent to GA4 directly when NEXT_PUBLIC_GA_ID is set. No-ops on the server or when blocked.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent = "tool_used" | "file_converted" | "download_clicked";

export function track(event: AnalyticsEvent, params: { tool_name: string } & Record<string, string | number>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}
