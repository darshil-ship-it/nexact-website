import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { ViewTracker } from "@/components/analytics/view-tracker";
import type { SolutionEntry } from "@/content/solutions";
import { solutionsIntro } from "@/content/solutions";

export function SolutionShowcase({ solution, index, reverse = false }: { solution: SolutionEntry; index: number; reverse?: boolean }) {
  const className = [
    "solution-showcase",
    solution.featured ? "solution-showcase--featured" : "",
    reverse ? "solution-showcase--reverse" : "",
  ].filter(Boolean).join(" ");

  return (
    <section className={className} id={solution.id} aria-labelledby={`${solution.id}-title`}>
      <ViewTracker event="solution_view" itemId={solution.id} itemName={solution.title} />
      <div className="container">
        <div className="solution-showcase__topline">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{solution.featured ? solutionsIntro.featuredLabel : solution.label}</span>
        </div>

        <div className="solution-showcase__layout">
          <Reveal className="solution-showcase__intro">
            <p className="solution-showcase__label">{solution.label}</p>
            <h2 id={`${solution.id}-title`}>{solution.title}</h2>
            <p className="solution-showcase__description">{solution.description}</p>
          </Reveal>

          <Reveal className="solution-showcase__visual" delay={0.08}>
            <Media asset={solution.media} sizes={solution.featured ? "(max-width: 767px) 100vw, 88vw" : "(max-width: 767px) 100vw, 52vw"} />
          </Reveal>

          <Reveal className="solution-showcase__details" delay={0.12}>
            <div className="solution-showcase__detail">
              <h3>{solutionsIntro.challengeLabel}</h3>
              <p>{solution.challenge}</p>
            </div>
            <div className="solution-showcase__detail">
              <h3>{solutionsIntro.approachLabel}</h3>
              <p>{solution.approach}</p>
            </div>
            <div className="solution-showcase__detail solution-showcase__outcomes">
              <h3>{solutionsIntro.outcomesLabel}</h3>
              <ul>{solution.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
            </div>
            <ButtonLink className="solution-showcase__cta" href={solution.cta.href}>
              {solution.cta.label}<ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
