import type { Service } from "@/types/content";
import { media } from "@/content/media";

export const servicesIntro = {
  eyebrow: "NEXACT GLOBAL / CAPABILITIES",
  title: "Services",
  description: "Thoughtful technology and digital work, shaped around the needs of each business.",
  note: "Service profiles below are draft content for review. Scope and examples can be refined with NexAct before launch.",
};

export interface ServiceEntry extends Service {
  enabled: boolean;
  order: number;
}

// Edit this list to add or remove a service. Change order to rearrange the page.
export const services: ServiceEntry[] = [
  {
    id: "digital-experiences",
    enabled: true,
    order: 1,
    label: "01 / DIGITAL EXPERIENCES · DRAFT",
    title: "Digital experiences that feel effortless.",
    context: "Make each interaction clearer, faster, and more useful.",
    description: "A draft service profile for customer-facing websites and digital journeys, ready to be tailored to NexAct’s verified offering.",
    points: ["Experience strategy", "Responsive web experiences", "Clear content journeys", "Accessibility and usability"],
    media: media.services.digitalExperiences,
    cta: { label: "Discuss a digital experience", href: "/book-meeting" },
  },
  {
    id: "product-engineering",
    enabled: true,
    order: 2,
    label: "02 / PRODUCT ENGINEERING · DRAFT",
    title: "Products built for the work ahead.",
    context: "From a focused idea to a dependable digital product.",
    description: "A draft profile for planning, designing, and developing products that can evolve alongside a business.",
    points: ["Product discovery", "Interface design", "Application development", "Maintainable foundations"],
    media: media.services.productEngineering,
    cta: { label: "Discuss a product", href: "/book-meeting" },
  },
  {
    id: "ai-automation",
    enabled: true,
    order: 3,
    label: "03 / AI & AUTOMATION · DRAFT",
    title: "Practical intelligence for everyday work.",
    context: "Find the opportunities where better workflows matter.",
    description: "A draft service profile for exploring responsible AI and automation in real business processes.",
    points: ["Opportunity assessment", "Workflow design", "Automation concepts", "Human oversight"],
    media: media.services.aiAutomation,
    cta: { label: "Explore an AI opportunity", href: "/book-meeting" },
  },
  {
    id: "business-systems",
    enabled: true,
    order: 4,
    label: "04 / BUSINESS SYSTEMS · DRAFT",
    title: "Systems that make progress easier.",
    context: "Connect information, teams, and operations with intention.",
    description: "A draft service profile for digital systems that help a business organize work and move with more clarity.",
    points: ["Process mapping", "System architecture", "Useful integrations", "Operational visibility"],
    media: media.services.businessSystems,
    cta: { label: "Discuss your systems", href: "/book-meeting" },
  },
];

export function getVisibleServices() {
  return services.filter((service) => service.enabled).toSorted((a, b) => a.order - b.order);
}
