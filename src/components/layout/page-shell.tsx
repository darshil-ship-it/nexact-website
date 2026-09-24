import { ButtonLink } from "@/components/ui/button";
import { pages, type PageKey } from "@/content/pages";
export function PageShell({ page }: { page: PageKey }) {
  const content = pages[page];
  return <div className="container page-shell"><p className="eyebrow">NEXACT GLOBAL</p><h1>{content.title}</h1><p className="intro">{content.description}</p><div className="foundation-note"><span className="eyebrow">Foundation preview</span><p>This page is prepared for the next design and content phase.</p></div><ButtonLink href="/" variant="secondary">Back to home</ButtonLink></div>;
}
