import type { NextConfig } from "next";
import { media } from "./src/content/media";

const imageHosts = new Set<string>();
function collectMediaHosts(value: unknown) {
  if (typeof value === "string" && value.startsWith("https://")) {
    try { imageHosts.add(new URL(value).hostname); } catch { /* Ignore incomplete media URLs. */ }
  } else if (Array.isArray(value)) {
    value.forEach(collectMediaHosts);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(collectMediaHosts);
  }
}
collectMediaHosts(media);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [...imageHosts].map((hostname) => ({ protocol: "https", hostname })) },
};
export default nextConfig;
