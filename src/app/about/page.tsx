import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";
import { AboutHero, WhoWeAre, OurPurpose, VisionAndMission, AboutJourney, AboutTeam, AboutCulture, AboutGlobalReach, AboutAchievements, AboutImpact, AboutFinalCta } from "@/components/sections/about/about-page";
import "./about.css";

export const metadata = pageMetadata("/about", "About", about.hero.description);

export default function Page() {
  return <>
    <AboutHero />
    <WhoWeAre />
    <OurPurpose />
    <VisionAndMission />
    <AboutJourney />
    <AboutTeam />
    <AboutCulture />
    <AboutGlobalReach />
    <AboutAchievements />
    <AboutImpact />
    <AboutFinalCta />
  </>;
}
