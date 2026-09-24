import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  const content = home.finalCta;
  return <section className="home-section final-cta"><div className="container"><Reveal className="final-cta__inner"><p className="home-kicker">{content.eyebrow}</p><h2>{content.title}</h2><p>{content.description}</p><div className="final-cta__actions"><Link className="button button--primary" href={content.primary.href}>{content.primary.label}</Link><Link className="button button--secondary" href={content.secondary.href}>{content.secondary.label}</Link></div><Link className="final-cta__supporting" href={content.supporting.href}>{content.supporting.label}<ArrowUpRight size={17} aria-hidden="true" /></Link></Reveal></div></section>;
}
