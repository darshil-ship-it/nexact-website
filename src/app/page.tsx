import { HomePageSections } from "@/components/sections/home/home-page-sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/", site.name, site.description);

export default function HomePage() {
  return <HomePageSections />;
}
