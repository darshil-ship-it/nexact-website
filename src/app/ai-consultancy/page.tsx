import { pageMetadata } from "@/lib/seo";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { comingSoon } from "@/content/coming-soon";
import "../coming-soon.css";
const content = comingSoon["ai-consultancy"];
export const metadata = pageMetadata("/ai-consultancy", content.headline, content.copy);
export default function Page() { return <ComingSoonPage content={content} />; }
