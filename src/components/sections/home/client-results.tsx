import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function ClientResults() {
  const content = home.selectedResults;
  return <section className="home-section client-results"><div className="container"><Reveal><SectionIntro {...content} align="split" /></Reveal></div><div className="home-snap-rail home-snap-rail--projects" role="region" aria-label="Selected client results, scroll horizontally" tabIndex={0}>{content.items.map((item) => <article className="project-card" key={item.id}><div className="project-card__media"><Media asset={item.media} sizes="(max-width: 767px) 84vw, 64vw" /></div><div className="project-card__body"><div><span className="home-kicker">{item.category}</span><h3>{item.title}</h3><p className="project-card__client">{item.client}</p></div><div><p>{item.description}</p>{item.metrics.length > 0 ? <ul className="verified-list">{item.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul> : <p className="home-data-pending">No metrics shown until verified.</p>}</div></div></article>)}</div></section>;
}
