import { media } from "@/content/media";
import type { Action, MediaAsset } from "@/types/content";

export interface ComingSoonContent {
  id: "growth-partner" | "ai-consultancy";
  label: string;
  headline: string;
  copy: string;
  keywords: string[];
  status: string;
  monogram: string;
  media: MediaAsset;
  primaryAction: Action;
  secondaryAction: Action;
}

export const comingSoon: Record<ComingSoonContent["id"], ComingSoonContent> = {
  "growth-partner": {
    id: "growth-partner",
    label: "NEXACT GROWTH PARTNER",
    headline: "Something bigger is growing.",
    copy: "A new NexAct experience built around strategy, growth, branding and long-term business partnership is coming soon.",
    keywords: ["Strategy", "Brand", "Growth", "Execution"],
    status: "A NEW CHAPTER IS TAKING SHAPE",
    monogram: "G",
    media: media.comingSoon.growthPartner,
    primaryAction: { label: "Get Notified", href: "/contact?intent=updates&area=growth-partner" },
    secondaryAction: { label: "Book a Meeting", href: "/book-meeting" },
  },
  "ai-consultancy": {
    id: "ai-consultancy",
    label: "NEXACT AI CONSULTANCY",
    headline: "Intelligence for what comes next.",
    copy: "We're building a dedicated AI consultancy experience to help businesses discover, design and implement practical AI opportunities.",
    keywords: ["AI Strategy", "Automation", "Agents", "Transformation"],
    status: "THE NEXT CONVERSATION STARTS HERE",
    monogram: "AI",
    media: media.comingSoon.aiConsultancy,
    primaryAction: { label: "Get Notified", href: "/contact?intent=updates&area=ai-consultancy" },
    secondaryAction: { label: "Talk to NexAct", href: "/contact?area=ai-consultancy" },
  },
};
