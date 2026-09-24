import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro, EmptyDataNote } from "./section-intro";

export function BeyondBusiness() {
  const content = home.beyondBusiness;
  return <section className="home-section beyond-business"><div className="container beyond-business__layout"><Reveal className="beyond-business__copy"><SectionIntro eyebrow={content.eyebrow} title={content.title} description={content.description} />{content.items.length > 0 ? <ul className="impact-list">{content.items.map((item) => <li key={item.id}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ul> : <EmptyDataNote>No initiatives are claimed until verified content is supplied.</EmptyDataNote>}</Reveal><Reveal className="beyond-business__media" delay={.08}><Media asset={content.media} /></Reveal></div></section>;
}
