import { media } from "@/content/media";
import type { Action, ImpactPost, MediaAsset, Metric, TeamMember, TimelineEntry } from "@/types/content";

export interface AboutContent {
  hero: { label: string; title: string; description: string; scrollLabel: string; media: MediaAsset };
  whoWeAre: { label: string; title: string; body: string; media: MediaAsset };
  purpose: { label: string; title: string; body: string; media: MediaAsset };
  vision: { label: string; title: string; body: string };
  mission: { label: string; title: string; body: string };
  journey: { label: string; title: string; description: string; emptyTitle: string; emptyBody: string; entries: TimelineEntry[]; media: MediaAsset };
  team: { label: string; title: string; description: string; emptyTitle: string; emptyBody: string; members: TeamMember[] };
  culture: { label: string; title: string; description: string; captions: string[]; media: MediaAsset[] };
  globalReach: { label: string; title: string; description: string; emptyNote: string; regions: string[]; media: MediaAsset };
  achievements: { label: string; title: string; description: string; emptyValue: string; categories: string[]; metrics: Metric[] };
  impact: { label: string; title: string; description: string; emptyNote: string; items: ImpactPost[]; media: MediaAsset };
  finalCta: { label: string; title: string; description: string; primary: Action; secondary: Action };
}

export const about: AboutContent = {
  hero: {
    label: "ABOUT NEXACT GLOBAL",
    title: "Intelligence That Moves Business Forward.",
    description: "A global technology company building intelligent products, digital systems, and business solutions for ambitious companies.",
    scrollLabel: "Discover our story",
    media: media.about.hero,
  },
  whoWeAre: {
    label: "01 / WHO WE ARE",
    title: "A company built around what comes next.",
    body: "NexAct Global builds intelligent products, digital systems, and business solutions for ambitious companies.",
    media: media.about.whoWeAre,
  },
  purpose: {
    label: "02 / OUR PURPOSE",
    title: "Purpose, defined with intention.",
    body: "NexAct's approved purpose statement will be added here before publication.",
    media: media.about.purpose,
  },
  vision: {
    label: "03 / VISION",
    title: "Looking ahead.",
    body: "NexAct's approved vision statement will be added here before publication.",
  },
  mission: {
    label: "04 / MISSION",
    title: "The work behind the ambition.",
    body: "NexAct's approved mission statement will be added here before publication.",
  },
  journey: {
    label: "05 / OUR JOURNEY",
    title: "A story told through real milestones.",
    description: "Company history will be presented here when dates and milestones have been confirmed.",
    emptyTitle: "The timeline begins with verified history.",
    emptyBody: "Founding dates, milestones, and the people behind them are awaiting approved source material.",
    entries: [],
    media: media.about.journey,
  },
  team: {
    label: "06 / TEAM",
    title: "Meet the people behind NexAct.",
    description: "Team profiles will be added when names, roles, and portraits are approved.",
    emptyTitle: "People first. Profiles when ready.",
    emptyBody: "The team roster is intentionally empty until verified member details are supplied.",
    members: [],
  },
  culture: {
    label: "07 / COMPANY CULTURE",
    title: "A closer look inside NexAct.",
    description: "Approved workplace, team, and event photography will shape this gallery.",
    captions: ["Team photography to be supplied", "Workplace photography to be supplied", "Company moment to be supplied"],
    media: media.about.culture,
  },
  globalReach: {
    label: "08 / GLOBAL REACH",
    title: "Connected by the work we do.",
    description: "Verified countries and regions can be shown here without implying offices or operations that have not been confirmed.",
    emptyNote: "Verified country and region details to be supplied.",
    regions: [],
    media: media.about.globalReach,
  },
  achievements: {
    label: "09 / ACHIEVEMENTS",
    title: "Proof belongs beside the story.",
    description: "Numbers, awards, and credentials will appear only with verified sources.",
    emptyValue: "—",
    categories: ["Clients served", "Projects delivered", "Markets", "Recognition"],
    metrics: [],
  },
  impact: {
    label: "10 / BEYOND BUSINESS",
    title: "Impact deserves a real record.",
    description: "This space is reserved for approved initiatives and documented outcomes beyond client work.",
    emptyNote: "No community or charity initiatives are claimed until details are verified.",
    items: [],
    media: media.about.impact,
  },
  finalCta: {
    label: "START A CONVERSATION",
    title: "What comes next starts with a conversation.",
    description: "Tell us what you are building, solving, or imagining next.",
    primary: { label: "Book a Meeting", href: "/book-meeting" },
    secondary: { label: "Contact Us", href: "/contact" },
  },
};
