import type { MediaAsset } from "@/types/content";
const placeholder = (label: string, type: MediaAsset["type"] = "image"): MediaAsset => ({
  src: "", alt: "", placeholder: label, type,
});
// All media URLs live here. Empty strings render labelled placeholders, never broken requests.
export const media = {
  home: {
    heroVideo: "https://res.cloudinary.com/rux4gvas/video/upload/v1789644331/Create_luxury_real_estate_video_20260917165509.mp4",
    heroPoster: "",
    heroLabel: "YOUR_POSTER_URL",
    clientResults: [placeholder("PROJECT_01_IMAGE_URL"), placeholder("PROJECT_02_IMAGE_URL"), placeholder("PROJECT_03_IMAGE_URL")],
    personalBranding: [placeholder("PERSONAL_BRANDING_01_BEFORE_URL"), placeholder("PERSONAL_BRANDING_01_AFTER_URL")],
    lifeAtNexAct: [placeholder("LIFE_AT_NEXACT_01_URL"), placeholder("LIFE_AT_NEXACT_02_URL"), placeholder("LIFE_AT_NEXACT_03_URL"), placeholder("LIFE_AT_NEXACT_04_URL")],
    companyShowcase: [placeholder("COMPANY_SHOWCASE_01_URL"), placeholder("COMPANY_SHOWCASE_02_URL"), placeholder("COMPANY_SHOWCASE_03_URL")],
    journey: [placeholder("JOURNEY_01_MEDIA_URL"), placeholder("JOURNEY_02_MEDIA_URL")],
    showcase: [placeholder("SOLUTION_01_MEDIA_URL"), placeholder("PRODUCT_01_MEDIA_URL"), placeholder("PROJECT_SHOWCASE_01_MEDIA_URL")],
    globalReach: placeholder("GLOBAL_MAP_MEDIA_URL"),
    beyondBusiness: placeholder("IMPACT_IMAGE_01_URL"),
  },
  services: {
    digitalExperiences: placeholder("DIGITAL_EXPERIENCES_MEDIA_URL"),
    productEngineering: placeholder("PRODUCT_ENGINEERING_MEDIA_URL"),
    aiAutomation: placeholder("AI_AUTOMATION_MEDIA_URL"),
    businessSystems: placeholder("BUSINESS_SYSTEMS_MEDIA_URL"),
  },
  solutions: {
    connectedExperience: placeholder("CONNECTED_EXPERIENCE_MEDIA_URL"),
    clearerOperations: placeholder("CLEARER_OPERATIONS_MEDIA_URL"),
    practicalIntelligence: placeholder("PRACTICAL_INTELLIGENCE_MEDIA_URL"),
  },
  comingSoon: {
    growthPartner: placeholder("GROWTH_PARTNER_BACKGROUND_URL"),
    aiConsultancy: placeholder("AI_CONSULTANCY_BACKGROUND_URL"),
  },
  about: {
    hero: placeholder("ABOUT_HERO_VIDEO_URL", "video"),
    whoWeAre: placeholder("ABOUT_COMPANY_IMAGE_URL"),
    purpose: placeholder("ABOUT_PURPOSE_IMAGE_URL"),
    journey: placeholder("ABOUT_JOURNEY_IMAGE_URL"),
    culture: [placeholder("ABOUT_CULTURE_IMAGE_01_URL"), placeholder("ABOUT_CULTURE_IMAGE_02_URL"), placeholder("ABOUT_CULTURE_IMAGE_03_URL")],
    globalReach: placeholder("ABOUT_GLOBAL_MAP_IMAGE_URL"),
    impact: placeholder("ABOUT_IMPACT_IMAGE_URL"),
  },
  projects: { project01: placeholder("PROJECT_01_IMAGE_URL") },
  branding: { before: placeholder("PERSONAL_BRANDING_01_BEFORE_URL"), after: placeholder("PERSONAL_BRANDING_01_URL") },
  company: { team01: placeholder("TEAM_IMAGE_01_URL"), life01: placeholder("LIFE_AT_NEXACT_01_URL") },
  global: placeholder("GLOBAL_MAP_MEDIA_URL"),
  impact: placeholder("IMPACT_IMAGE_01_URL"),
};
