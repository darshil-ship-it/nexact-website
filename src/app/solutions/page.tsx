import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { SolutionShowcase } from "@/components/sections/solution-showcase";
import { getVisibleSolutions, solutionsIntro } from "@/content/solutions";
import "./solutions.css";

export const metadata = pageMetadata("/solutions", solutionsIntro.title, solutionsIntro.statement);

export default function SolutionsPage() {
  const solutions = getVisibleSolutions();

  return (
    <div className="solutions-page">
      <header className="solutions-hero">
        <div className="container">
          <Reveal className="solutions-hero__heading">
            <p className="solutions-hero__eyebrow">{solutionsIntro.eyebrow}</p>
            <h1>{solutionsIntro.title}</h1>
          </Reveal>
          <Reveal className="solutions-hero__summary" delay={0.08}>
            <p className="solutions-hero__statement">{solutionsIntro.statement}</p>
            <p className="solutions-hero__description">{solutionsIntro.description}</p>
          </Reveal>
        </div>
      </header>

      <div className="solutions-page__showcases">
        {solutions.map((solution, index) => (
          <SolutionShowcase key={solution.id} solution={solution} index={index} reverse={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
}
