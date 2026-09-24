import { home } from "@/content/home";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro, EmptyDataNote } from "./section-intro";

export function Achievements() {
  const content = home.achievements;
  return <section className="home-section achievements"><div className="container"><Reveal><SectionIntro eyebrow={content.eyebrow} title={content.title} description={content.description} /></Reveal>{content.metrics.length === 0 && <Reveal><EmptyDataNote>Verified figures will populate these fields before publication.</EmptyDataNote></Reveal>}<div className="achievements__grid">{content.metrics.length > 0 ? content.metrics.map((metric, index) => <Reveal className="achievement-slot" key={metric.label} delay={index * .04}><strong>{metric.value}{metric.suffix}</strong><p>{metric.label}</p></Reveal>) : content.slots.map((slot, index) => <Reveal className="achievement-slot" key={slot} delay={index * .04}><span aria-hidden="true">—</span><p>{slot}</p></Reveal>)}</div></div></section>;
}
