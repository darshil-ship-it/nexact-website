import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { AmbientVideo } from "@/components/ui/ambient-video";
import type { ComingSoonContent } from "@/content/coming-soon";

export function ComingSoonPage({ content }: { content: ComingSoonContent }) {
  const isAi = content.id === "ai-consultancy";

  return (
    <div className={`coming-soon coming-soon--${isAi ? "ai" : "growth"}`}>
      <section className="coming-soon__hero container" aria-labelledby="coming-soon-title">
        <div className="coming-soon__copy">
          <Reveal>
            <p className="coming-soon__eyebrow"><span aria-hidden="true" />{content.label}</p>
            <h1 id="coming-soon-title">{content.headline}</h1>
            <p className="coming-soon__description">{content.copy}</p>
            <div className="coming-soon__actions">
              <ButtonLink href={content.primaryAction.href}>{content.primaryAction.label}<ArrowUpRight size={17} aria-hidden="true" /></ButtonLink>
              <ButtonLink href={content.secondaryAction.href} variant="secondary">{content.secondaryAction.label}<ArrowUpRight size={17} aria-hidden="true" /></ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="coming-soon__aside">
            <span className="coming-soon__aside-line" aria-hidden="true" />
            <span>COMING SOON</span>
            <ArrowDownRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Reveal>
        </div>

        <Reveal className="coming-soon__visual-wrap" delay={0.12}>
          <div className={`coming-soon__visual${content.media.src ? " has-media" : ""}`}>
            {content.media.src && (content.media.type === "video" ? (
              <AmbientVideo className="coming-soon__background" src={content.media.src} poster={content.media.poster} />
            ) : (
              <Image className="coming-soon__background" src={content.media.src} alt={content.media.alt} fill sizes="(max-width: 899px) 100vw, 50vw" loading="lazy" />
            ))}
            <div className="coming-soon__visual-shade" aria-hidden="true" />
            <div className="coming-soon__visual-top"><span>NEXACT / {isAi ? "AI" : "GROWTH"}</span><span>01 — 04</span></div>
            <span className="coming-soon__monogram" aria-hidden="true">{content.monogram}</span>
            <div className="coming-soon__visual-bottom">
              <p>{content.status}</p>
              <ul aria-label="Focus areas">{content.keywords.map((keyword, index) => <li key={keyword}><span>0{index + 1}</span>{keyword}</li>)}</ul>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
