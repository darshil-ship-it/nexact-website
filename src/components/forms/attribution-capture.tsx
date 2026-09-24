"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export const UTM_STORAGE_KEY = "nexact:utm";
export const CTA_STORAGE_KEY = "nexact:lead-cta";
const destinations = new Set(["/contact", "/book-meeting", "/get-quote"]);

export function AttributionCapture() {
  useEffect(() => {
    try {
      const current = new URL(window.location.href);
      const saved: unknown = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
      const stored: Record<string, string> = saved && typeof saved === "object" && !Array.isArray(saved) ? saved as Record<string, string> : {};
      for (const key of UTM_KEYS) {
        const value = current.searchParams.get(key);
        if (value) stored[key] = value.slice(0, 256);
      }
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(stored));
    } catch { /* Storage can be unavailable in private browsing. */ }

    function captureClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      let destination: URL;
      try { destination = new URL(anchor.getAttribute("href") || "", window.location.href); } catch { return; }
      if (destination.origin !== window.location.origin || !destinations.has(destination.pathname)) return;
      const section = anchor.closest("section");
      const sectionName = section?.id || section?.getAttribute("data-section-source") || Array.from(section?.classList || []).at(-1) || (anchor.closest("header") ? "header" : anchor.closest("footer") ? "footer" : "page");
      const attribution = {
        destination: destination.pathname,
        page_source: window.location.pathname,
        section_source: sectionName,
        cta_source: anchor.getAttribute("data-cta-source") || anchor.getAttribute("aria-label") || anchor.textContent?.trim().slice(0, 120) || "link",
      };
      try { sessionStorage.setItem(CTA_STORAGE_KEY, JSON.stringify(attribution)); } catch { /* Keep navigation working. */ }
      const eventName = destination.pathname === "/book-meeting" ? "book_meeting_click" : destination.pathname === "/get-quote" ? "quote_click" : "contact_click";
      trackEvent(eventName, { page_source: attribution.page_source, section_source: attribution.section_source, cta_source: attribution.cta_source });
    }
    document.addEventListener("click", captureClick, true);
    return () => document.removeEventListener("click", captureClick, true);
  }, []);
  return null;
}
