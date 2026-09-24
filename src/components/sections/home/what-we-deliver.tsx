import { home } from "@/content/home";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function WhatWeDeliver() {
  const content = home.whatWeDeliver;
  return <section className="home-section deliver"><div className="container"><Reveal><SectionIntro {...content} /></Reveal><div className="deliver__grid">{content.outcomes.map((outcome, index) => <Reveal key={outcome} className={`deliver__card deliver__card--${(index % 4) + 1}`} delay={index * .035}><span>{String(index + 1).padStart(2, "0")}</span><h3>{outcome}</h3></Reveal>)}</div></div></section>;
}
