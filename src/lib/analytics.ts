import { gaId, gtmId } from "@/lib/analytics-config";

export type AnalyticsEvent =
  | "book_meeting_click" | "quote_click" | "contact_click"
  | "contact_submit" | "meeting_submit" | "quote_submit"
  | "service_view" | "solution_view" | "project_view";

type AnalyticsParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  if (gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...parameters });
  } else if (gaId) {
    window.gtag?.("event", event, parameters);
  }
}
