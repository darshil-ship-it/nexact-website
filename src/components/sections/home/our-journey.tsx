import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function OurJourney() {
  const content = home.journey;
  return <section className="home-section journey"><div className="container"><Reveal><SectionIntro eyebrow={content.eyebrow} title={content.title} description={content.description} align="split" /></Reveal><div className="journey__list">{content.entries.map((entry, index) => <article className={`journey__entry ${index % 2 ? "journey__entry--reverse" : ""}`} key={entry.id}><Reveal className="journey__copy"><span className="journey__date">{entry.date}</span><h3>{entry.title}</h3><p>{entry.description}</p></Reveal><Reveal className="journey__media" delay={.08}><Media asset={entry.media} /></Reveal></article>)}</div></div></section>;
}
