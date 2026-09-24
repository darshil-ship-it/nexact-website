"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function ViewTracker({ event, itemId, itemName }: { event: Extract<AnalyticsEvent, "service_view" | "solution_view" | "project_view">; itemId: string; itemName: string }) {
  const pathname = usePathname();
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const target = marker.current?.closest("section, article");
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        trackEvent(event, { item_id: itemId, item_name: itemName, page_path: pathname });
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [event, itemId, itemName, pathname]);
  return <span ref={marker} hidden />;
}
