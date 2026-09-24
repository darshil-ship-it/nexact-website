import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro, EmptyDataNote } from "./section-intro";

export function GlobalReach() {
  const content = home.globalReach;
  return <section className="home-section global-reach"><div className="container global-reach__layout"><Reveal className="global-reach__copy"><SectionIntro eyebrow={content.eyebrow} title={content.title} description={content.description} />{content.regions.length > 0 ? <ul className="verified-list">{content.regions.map((region) => <li key={region}>{region}</li>)}</ul> : <EmptyDataNote>Verified countries and regions to be supplied.</EmptyDataNote>}</Reveal><Reveal className="global-reach__media" delay={.08}><Media asset={content.media} sizes="(max-width: 767px) 100vw, 60vw" /></Reveal></div></section>;
}
