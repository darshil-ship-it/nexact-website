"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gaId, gtmId } from "@/lib/analytics-config";

export function PageViews() {
  const pathname = usePathname();
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    if (process.env.NODE_ENV !== "production") return;
    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "page_view", page_path: pathname });
    } else if (gaId) {
      window.gtag?.("config", gaId, { page_path: pathname });
    }
  }, [pathname]);
  return null;
}
