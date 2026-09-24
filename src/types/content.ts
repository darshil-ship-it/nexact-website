export interface MediaAsset {
  src: string;
  alt: string;
  placeholder: string;
  type: "image" | "video";
  poster?: string;
}
export interface Action { label: string; href: string }
export interface Service {
  id: string; label: string; title: string; context: string;
  description: string; points: string[]; media: MediaAsset; cta: Action;
}
export interface Solution {
  id: string; title: string; label: string; description: string;
  challenge: string; approach: string; outcomes: string[]; media: MediaAsset; cta: Action;
}
export interface Project {
  id: string; title: string; client: string; category: string;
  description: string; media: MediaAsset; metrics: Metric[]; cta?: Action;
}
export interface Metric { label: string; value: number; suffix?: string; source: string }
export interface TeamMember { id: string; name: string; role: string; media: MediaAsset }
export interface TimelineEntry { date: string; title: string; description: string }
export interface ImpactPost { id: string; title: string; description: string; media: MediaAsset }
export interface BrandingResult {
  id: string; title: string; description: string; before: MediaAsset; after: MediaAsset;
  screenshots: MediaAsset[]; results: string[]; metrics: Metric[];
}
