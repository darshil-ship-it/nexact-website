import { home } from "@/content/home";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "./section-intro";

export function PersonalBrandingResults() {
  const content = home.personalBranding;
  return <section className="home-section branding-results"><div className="container"><Reveal><SectionIntro {...content} /></Reveal>{content.items.map((item) => <div className="branding-results__story" key={item.id}><Reveal className="branding-results__copy"><span className="home-kicker">Result profile</span><h3>{item.title}</h3><p>{item.description}</p>{item.metrics.length > 0 ? <ul className="verified-list">{item.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul> : <p className="home-data-pending">Verified results to be supplied.</p>}</Reveal><div className="branding-results__media"><Reveal className="comparison-frame"><span>{item.beforeLabel}</span><Media asset={item.before} /></Reveal><Reveal className="comparison-frame" delay={.08}><span>{item.afterLabel}</span><Media asset={item.after} /></Reveal></div></div>)}</div></section>;
}
