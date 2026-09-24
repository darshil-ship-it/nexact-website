import type { Metadata } from "next";
import { site } from "@/content/site";

export function siteOrigin(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return undefined;
  try {
    const url = new URL(configured);
    if (!(["https:", "http:"].includes(url.protocol)) || url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    return url.origin;
  } catch { return undefined; }
}

export function isIndexable(): boolean {
  return process.env.NODE_ENV === "production" && Boolean(siteOrigin());
}

export function pageMetadata(path: string, title: string, description: string, index = true): Metadata {
  const origin = siteOrigin();
  const url = origin ? new URL(path, `${origin}/`).href : undefined;
  return {
    title: title === site.name ? { absolute: site.name } : title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: { type: "website", siteName: site.name, locale: site.locale, title: title === site.name ? site.name : `${title} | ${site.name}`, description, ...(url ? { url } : {}) },
    twitter: { card: "summary", title: title === site.name ? site.name : `${title} | ${site.name}`, description },
    ...(!index ? { robots: { index: false, follow: false } } : {}),
  };
}
