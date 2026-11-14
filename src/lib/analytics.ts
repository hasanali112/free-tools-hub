/** GA4 event helpers. No-ops when GA isn't configured or blocked. */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent = "tool_used" | "file_converted" | "download_clicked";

export function track(event: AnalyticsEvent, params: { tool_name: string } & Record<string, string | number>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
