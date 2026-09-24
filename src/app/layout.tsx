import type { Metadata } from "next";
import { site } from "@/content/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AttributionCapture } from "@/components/forms/attribution-capture";
import { AnalyticsScripts, TagManagerNoScript } from "@/components/analytics/analytics-scripts";
import { PageViews } from "@/components/analytics/page-views";
import { isIndexable, siteOrigin } from "@/lib/seo";
import "./globals.css";
import "./home-sections.css";
const origin = siteOrigin();
export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  title: { default: site.name, template: `%s | ${site.name}` }, description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: site.locale, title: site.name, description: site.description, ...(origin ? { url: origin } : {}) },
  twitter: { card: "summary", title: site.name, description: site.description },
  robots: { index: isIndexable(), follow: isIndexable() },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    ...(origin ? { url: origin, "@id": `${origin}/#organization` } : {}),
    ...(Object.values(site.social).filter(Boolean).length ? { sameAs: Object.values(site.social).filter(Boolean) } : {}),
  };
  return <html lang={site.locale} data-scroll-behavior="smooth"><body><TagManagerNoScript /><AnalyticsScripts /><PageViews /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} /><AttributionCapture /><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}
