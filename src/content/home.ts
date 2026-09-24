import { media } from "@/content/media";

export const home = {
  hero: {
    label: "NEXACT GLOBAL",
    titleLines: ["Intelligence That Moves", "Business Forward."],
    description: "A global technology company building intelligent products, digital systems, and business solutions for ambitious companies.",
    primary: { label: "Book a Meeting", href: "/book-meeting" },
    secondary: { label: "Explore NexAct", href: "/about" },
  },
  weWorkWith: {
    eyebrow: "We work with",
    title: "Built for ambitious businesses at different stages.",
    description: "Customer categories will be replaced with verified NexAct segments before launch.",
    categories: [
      { label: "Customer category 01", description: "Verified customer segment to be supplied." },
      { label: "Customer category 02", description: "Verified customer segment to be supplied." },
      { label: "Customer category 03", description: "Verified customer segment to be supplied." },
      { label: "Customer category 04", description: "Verified customer segment to be supplied." },
    ],
  },
  whatWeDeliver: {
    eyebrow: "What we deliver",
    title: "Business outcomes, shaped through technology.",
    description: "A flexible set of capabilities designed around the result a business needs next.",
    outcomes: ["Business Growth", "Digital Presence", "Smarter Operations", "AI Efficiency", "Customer Experience", "Scalable Technology", "Brand Visibility"],
  },
  selectedResults: {
    eyebrow: "Selected client results",
    title: "Work presented with the space it deserves.",
    description: "Verified client names, project details and outcomes will be added when supplied.",
    items: [
      { id: "result-01", index: "01", title: "Client result profile", client: "Client name to be supplied", category: "Category to be supplied", description: "A configurable case study placeholder for verified work, context and outcomes.", media: media.home.clientResults[0], metrics: [] as string[] },
      { id: "result-02", index: "02", title: "Client result profile", client: "Client name to be supplied", category: "Category to be supplied", description: "A configurable case study placeholder for verified work, context and outcomes.", media: media.home.clientResults[1], metrics: [] as string[] },
      { id: "result-03", index: "03", title: "Client result profile", client: "Client name to be supplied", category: "Category to be supplied", description: "A configurable case study placeholder for verified work, context and outcomes.", media: media.home.clientResults[2], metrics: [] as string[] },
    ],
  },
  personalBranding: {
    eyebrow: "Personal branding results",
    title: "A clearer presence, shown before and after.",
    description: "Real work, screenshots and verified results will replace this neutral profile.",
    items: [
      { id: "branding-01", title: "Personal brand profile", description: "Before-and-after materials and confirmed outcomes to be supplied.", beforeLabel: "Before", afterLabel: "After", before: media.home.personalBranding[0], after: media.home.personalBranding[1], metrics: [] as string[] },
    ],
  },
  lifeAtNexAct: {
    eyebrow: "Life at NexAct",
    title: "The people and moments behind the work.",
    description: "Company photography and film will be added from the NexAct media library.",
    items: media.home.lifeAtNexAct.map((asset, index) => ({ id: `life-${index + 1}`, label: `Company memory ${String(index + 1).padStart(2, "0")}`, asset })),
  },
  companyShowcase: {
    eyebrow: "Inside NexAct",
    title: "How the company works, builds and grows.",
    items: [
      { id: "company-01", label: "Company showcase 01", title: "Team and workplace story", description: "Verified copy for the team, office or working culture will be added here.", media: media.home.companyShowcase[0] },
      { id: "company-02", label: "Company showcase 02", title: "Client and event story", description: "Verified copy for meetings, events or presentations will be added here.", media: media.home.companyShowcase[1] },
      { id: "company-03", label: "Company showcase 03", title: "Building and delivery story", description: "Verified copy for product building or behind-the-scenes work will be added here.", media: media.home.companyShowcase[2] },
    ],
  },
  journey: {
    eyebrow: "Our journey",
    title: "A company story designed to grow over time.",
    description: "Dates and milestones remain deliberately unclaimed until NexAct supplies its verified history.",
    entries: [
      { id: "journey-01", date: "DATE TO BE SUPPLIED", title: "Company milestone", description: "Verified milestone details to be supplied.", media: media.home.journey[0] },
      { id: "journey-02", date: "DATE TO BE SUPPLIED", title: "Company milestone", description: "Verified milestone details to be supplied.", media: media.home.journey[1] },
    ],
  },
  showcase: {
    eyebrow: "Solutions, products and projects",
    title: "One focused story at a time.",
    description: "Feature profiles are ready for verified solutions, products and projects.",
    items: [
      { id: "showcase-01", category: "SOLUTION PROFILE", title: "Featured solution", description: "Verified solution copy and destination to be supplied.", href: "/solutions", cta: "Explore solutions", media: media.home.showcase[0] },
      { id: "showcase-02", category: "PRODUCT PROFILE", title: "Featured product", description: "Verified product copy and destination to be supplied.", href: "/solutions", cta: "Explore NexAct", media: media.home.showcase[1] },
      { id: "showcase-03", category: "PROJECT PROFILE", title: "Featured project", description: "Verified project copy and destination to be supplied.", href: "/services", cta: "Explore services", media: media.home.showcase[2] },
    ],
  },
  achievements: {
    eyebrow: "Achievements and trust",
    title: "Trust should be backed by evidence.",
    description: "No statistics, certifications, partnerships or awards are shown until verified data is supplied.",
    slots: ["Clients served", "Years", "Projects", "Markets", "Certifications", "Partnerships"],
    metrics: [] as { label: string; value: number; suffix?: string; source: string }[],
  },
  globalReach: {
    eyebrow: "Global reach",
    title: "Connected across the markets NexAct actually serves.",
    description: "Countries and regions will appear only when verified. No office locations are implied.",
    regions: [] as string[],
    media: media.home.globalReach,
  },
  beyondBusiness: {
    eyebrow: "Beyond business",
    title: "A place for verified community impact.",
    description: "Real initiatives, photography and details will be published here when supplied. No charity claims are currently made.",
    items: [] as { id: string; title: string; description: string }[],
    media: media.home.beyondBusiness,
  },
  finalCta: {
    eyebrow: "Start a conversation",
    title: "What should we build next?",
    description: "Bring us the opportunity, the challenge or the next ambitious idea.",
    primary: { label: "Book a Meeting", href: "/book-meeting" },
    secondary: { label: "Get a Quote", href: "/get-quote" },
    supporting: { label: "Contact Us", href: "/contact" },
  },
};

export const homeSectionIds = ["hero", "we-work-with", "what-we-deliver", "client-results", "personal-branding", "life-at-nexact", "company-showcase", "our-journey", "solutions-showcase", "achievements", "global-reach", "beyond-business", "final-cta"] as const;
export type HomeSectionId = typeof homeSectionIds[number];

export const homeSections: { id: HomeSectionId; enabled: boolean; order: number }[] = homeSectionIds.map((id, index) => ({ id, enabled: true, order: index + 1 }));

export function getHomeSections() {
  return homeSections.filter((section) => section.enabled).toSorted((a, b) => a.order - b.order);
}
