import type { MetadataRoute } from "next";
import { isIndexable, siteOrigin } from "@/lib/seo";

const publicRoutes = ["/", "/services", "/solutions", "/growth-partner", "/ai-consultancy", "/about", "/contact", "/book-meeting", "/get-quote"];
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin || !isIndexable()) return [];
  return publicRoutes.map(path => ({ url: new URL(path, `${origin}/`).href }));
}
