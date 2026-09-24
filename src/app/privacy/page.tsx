import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/layout/page-shell";
import { pages } from "@/content/pages";
export const metadata = pageMetadata("/privacy", pages["privacy"].title, pages["privacy"].description, false);
export default function Page() { return <PageShell page="privacy" />; }
