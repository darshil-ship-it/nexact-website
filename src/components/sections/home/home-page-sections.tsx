import type { ComponentType } from "react";
import { getHomeSections, type HomeSectionId } from "@/content/home";
import { HomeHero } from "@/components/sections/home-hero";
import { WeWorkWith } from "./we-work-with";
import { WhatWeDeliver } from "./what-we-deliver";
import { ClientResults } from "./client-results";
import { PersonalBrandingResults } from "./personal-branding-results";
import { LifeAtNexAct } from "./life-at-nexact";
import { CompanyShowcase } from "./company-showcase";
import { OurJourney } from "./our-journey";
import { Showcase } from "./showcase";
import { Achievements } from "./achievements";
import { GlobalReach } from "./global-reach";
import { BeyondBusiness } from "./beyond-business";
import { FinalCta } from "./final-cta";

const sectionRegistry: Record<HomeSectionId, ComponentType> = {
  hero: HomeHero,
  "we-work-with": WeWorkWith,
  "what-we-deliver": WhatWeDeliver,
  "client-results": ClientResults,
  "personal-branding": PersonalBrandingResults,
  "life-at-nexact": LifeAtNexAct,
  "company-showcase": CompanyShowcase,
  "our-journey": OurJourney,
  "solutions-showcase": Showcase,
  achievements: Achievements,
  "global-reach": GlobalReach,
  "beyond-business": BeyondBusiness,
  "final-cta": FinalCta,
};

export function HomePageSections() {
  return getHomeSections().map(({ id }) => {
    const SectionComponent = sectionRegistry[id];
    return <SectionComponent key={id} />;
  });
}
