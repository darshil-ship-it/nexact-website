import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/layout/page-shell";
import { pages } from "@/content/pages";
export const metadata = pageMetadata("/terms", pages["terms"].title, pages["terms"].description, false);
export default function Page() { return <PageShell page="terms" />; }
