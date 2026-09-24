import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { about } from "@/content/about";
import { ButtonLink } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";

function SectionLead({ label, title, description, id }: { label: string; title: string; description?: string; id: string }) {
  return <Reveal className="about-lead"><p className="about-label">{label}</p><h2 id={id}>{title}</h2>{description && <p className="about-lead__description">{description}</p>}</Reveal>;
}

export function AboutHero() {
  const content = about.hero;
  return <section className="about-hero" aria-labelledby="about-hero-title"><div className="container">
    <Reveal className="about-hero__intro"><p className="about-label">{content.label}</p><h1 id="about-hero-title">{content.title}</h1><div className="about-hero__bottom"><p>{content.description}</p><a href="#who-we-are">{content.scrollLabel}<ArrowDownRight aria-hidden="true" size={18} strokeWidth={1.6} /></a></div></Reveal>
    <Reveal className="about-hero__media" delay={.08}><Media asset={content.media} sizes="(max-width: 767px) 100vw, 88vw" /></Reveal>
  </div></section>;
}

export function WhoWeAre() {
  const content = about.whoWeAre;
  return <section className="about-section about-story" id="who-we-are" aria-labelledby="about-who-title"><div className="container about-story__layout"><Reveal className="about-story__copy"><p className="about-label">{content.label}</p><h2 id="about-who-title">{content.title}</h2><p>{content.body}</p></Reveal><Reveal className="about-story__visual" delay={.08}><Media asset={content.media} /></Reveal></div></section>;
}

export function OurPurpose() {
  const content = about.purpose;
  return <section className="about-section about-story about-story--purpose" aria-labelledby="about-purpose-title"><div className="container about-story__layout"><Reveal className="about-story__copy"><p className="about-label">{content.label}</p><h2 id="about-purpose-title">{content.title}</h2><p>{content.body}</p></Reveal><Reveal className="about-story__visual" delay={.08}><Media asset={content.media} /></Reveal></div></section>;
}

export function VisionAndMission() {
  return <div className="about-principles"><section className="about-principle" aria-labelledby="about-vision-title"><div className="container about-principle__inner"><Reveal><p className="about-label">{about.vision.label}</p><h2 id="about-vision-title">{about.vision.title}</h2></Reveal><Reveal delay={.08}><p>{about.vision.body}</p></Reveal></div></section><section className="about-principle about-principle--mission" aria-labelledby="about-mission-title"><div className="container about-principle__inner"><Reveal><p className="about-label">{about.mission.label}</p><h2 id="about-mission-title">{about.mission.title}</h2></Reveal><Reveal delay={.08}><p>{about.mission.body}</p></Reveal></div></section></div>;
}

export function AboutJourney() {
  const content = about.journey;
  return <section className="about-section about-journey" aria-labelledby="about-journey-title"><div className="container"><div className="about-journey__head"><Reveal><p className="about-label">{content.label}</p><h2 id="about-journey-title">{content.title}</h2></Reveal><Reveal delay={.08}><p>{content.description}</p></Reveal></div>
    {content.entries.length > 0 ? <div className="about-journey__entries">{content.entries.map((entry, index) => <Reveal key={`${entry.date}-${index}`} className="about-journey__entry"><span>{entry.date}</span><h3>{entry.title}</h3><p>{entry.description}</p></Reveal>)}</div> : <div className="about-journey__empty"><Reveal className="about-journey__empty-copy"><span className="about-journey__rule" aria-hidden="true" /><h3>{content.emptyTitle}</h3><p>{content.emptyBody}</p></Reveal><Reveal className="about-journey__media" delay={.08}><Media asset={content.media} /></Reveal></div>}
  </div></section>;
}

export function AboutTeam() {
  const content = about.team;
  return <section className="about-section about-team" aria-labelledby="about-team-title"><div className="container"><div className="about-team__head"><SectionLead id="about-team-title" label={content.label} title={content.title} description={content.description} /><Reveal><span className="about-team__count">{String(content.members.length).padStart(2, "0")}</span></Reveal></div>
    {content.members.length > 0 ? <div className="about-team__grid">{content.members.map((person) => <Reveal className="about-team__person" key={person.id}><Media asset={person.media} /><h3>{person.name}</h3><p>{person.role}</p></Reveal>)}</div> : <Reveal className="about-team__empty"><span aria-hidden="true">N.</span><div><h3>{content.emptyTitle}</h3><p>{content.emptyBody}</p></div></Reveal>}
  </div></section>;
}

export function AboutCulture() {
  const content = about.culture;
  return <section className="about-section about-culture" aria-labelledby="about-culture-title"><div className="container"><SectionLead id="about-culture-title" label={content.label} title={content.title} description={content.description} /></div><div className="about-culture__rail" role="region" aria-label="Company culture gallery, scroll horizontally" tabIndex={0}>{content.media.map((asset, index) => <Reveal className="about-culture__item" key={asset.placeholder} delay={index * .06}><Media asset={asset} sizes="(max-width: 767px) 78vw, 35vw" /><p>{String(index + 1).padStart(2, "0")} / {content.captions[index]}</p></Reveal>)}</div></section>;
}

export function AboutGlobalReach() {
  const content = about.globalReach;
  return <section className="about-section about-reach" aria-labelledby="about-reach-title"><div className="container about-reach__layout"><Reveal className="about-reach__copy"><p className="about-label">{content.label}</p><h2 id="about-reach-title">{content.title}</h2><p>{content.description}</p>{content.regions.length > 0 ? <ul>{content.regions.map((region) => <li key={region}>{region}</li>)}</ul> : <p className="about-note">{content.emptyNote}</p>}</Reveal><Reveal className="about-reach__visual" delay={.08}><Media asset={content.media} sizes="(max-width: 767px) 100vw, 55vw" /></Reveal></div></section>;
}

export function AboutAchievements() {
  const content = about.achievements;
  return <section className="about-section about-achievements" aria-labelledby="about-achievements-title"><div className="container"><SectionLead id="about-achievements-title" label={content.label} title={content.title} description={content.description} /><div className="about-achievements__grid">{content.metrics.length > 0 ? content.metrics.map((metric) => <Reveal className="about-achievements__item" key={metric.label}><strong>{metric.value}{metric.suffix}</strong><span>{metric.label}</span></Reveal>) : content.categories.map((category) => <Reveal className="about-achievements__item" key={category}><strong>{content.emptyValue}</strong><span>{category}</span></Reveal>)}</div></div></section>;
}

export function AboutImpact() {
  const content = about.impact;
  return <section className="about-section about-impact" aria-labelledby="about-impact-title"><div className="container about-impact__layout"><Reveal className="about-impact__copy"><p className="about-label">{content.label}</p><h2 id="about-impact-title">{content.title}</h2><p>{content.description}</p>{content.items.length > 0 ? <ul>{content.items.map((item) => <li key={item.id}><h3>{item.title}</h3><p>{item.description}</p><Media asset={item.media} sizes="(max-width: 767px) 100vw, 40vw" /></li>)}</ul> : <p className="about-note">{content.emptyNote}</p>}</Reveal><Reveal className="about-impact__visual" delay={.08}><Media asset={content.media} /></Reveal></div></section>;
}

export function AboutFinalCta() {
  const content = about.finalCta;
  return <section className="about-final" aria-labelledby="about-final-title"><div className="container"><Reveal><p className="about-label">{content.label}</p><h2 id="about-final-title">{content.title}</h2><p>{content.description}</p><div className="about-final__actions"><ButtonLink href={content.primary.href}>{content.primary.label}<ArrowUpRight aria-hidden="true" size={17} /></ButtonLink><ButtonLink href={content.secondary.href} variant="secondary">{content.secondary.label}<ArrowUpRight aria-hidden="true" size={17} /></ButtonLink></div></Reveal></div></section>;
}
