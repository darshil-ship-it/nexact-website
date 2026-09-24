import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function CompanyShowcase() {
  const content = home.companyShowcase;
  return <section className="home-section company-showcase"><div className="container"><Reveal><SectionIntro eyebrow={content.eyebrow} title={content.title} /></Reveal><div className="zigzag-list">{content.items.map((item, index) => <article className={`zigzag-row ${index % 2 ? "zigzag-row--reverse" : ""}`} key={item.id}><Reveal className="zigzag-row__copy"><span className="home-kicker">{item.label}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal><Reveal className="zigzag-row__media" delay={.08}><Media asset={item.media} /></Reveal></article>)}</div></div></section>;
}
