import { pageMetadata } from "@/lib/seo";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { comingSoon } from "@/content/coming-soon";
import "../coming-soon.css";
const content = comingSoon["growth-partner"];
export const metadata = pageMetadata("/growth-partner", content.headline, content.copy);
export default function Page() { return <ComingSoonPage content={content} />; }
