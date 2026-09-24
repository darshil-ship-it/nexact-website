import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function LifeAtNexAct() {
  const content = home.lifeAtNexAct;
  return <section className="home-section life-at"><div className="container"><Reveal><SectionIntro {...content} align="split" /></Reveal></div><div className="home-snap-rail home-snap-rail--gallery" role="region" aria-label="Life at NexAct gallery, scroll horizontally" tabIndex={0}>{content.items.map((item, index) => <figure className={`life-card life-card--${(index % 3) + 1}`} key={item.id}><Media asset={item.asset} sizes="(max-width: 767px) 78vw, 38vw" /><figcaption>{item.label}</figcaption></figure>)}</div></section>;
}
