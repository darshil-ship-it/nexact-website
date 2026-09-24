import { home } from "@/content/home";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function WeWorkWith() {
  const content = home.weWorkWith;
  return <section className="home-section work-with"><div className="container"><Reveal><SectionIntro {...content} align="split" /></Reveal><div className="work-with__grid">{content.categories.map((category, index) => <Reveal key={category.label} className="work-with__item" delay={index * .05}><span>{String(index + 1).padStart(2, "0")}</span><h3>{category.label}</h3><p>{category.description}</p></Reveal>)}</div></div></section>;
}
