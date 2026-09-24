import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";
import { ViewTracker } from "@/components/analytics/view-tracker";

export function Showcase() {
  const content = home.showcase;
  return <section className="home-section showcase"><div className="container"><Reveal><SectionIntro {...content} align="split" /></Reveal></div><div className="home-snap-rail home-snap-rail--showcase" role="region" aria-label="Solutions, products and projects, scroll horizontally" tabIndex={0}>{content.items.map((item) => <article className="showcase-card" key={item.id}><ViewTracker event="project_view" itemId={item.id} itemName={item.title} /><div className="showcase-card__media"><Media asset={item.media} sizes="(max-width: 767px) 86vw, 72vw" /></div><div className="showcase-card__body"><span className="home-kicker">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href}>{item.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></article>)}</div></section>;
}
