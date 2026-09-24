export type FormType = "contact" | "book-meeting" | "get-quote";
export type FieldName = "name" | "email" | "phone" | "company" | "subject" | "message" | "country" | "interested_in" | "requirement" | "service_solution" | "project_description" | "budget_range" | "timeline" | "preferred_contact";
export interface FormField { name: FieldName; label: string; type: "text" | "email" | "tel" | "textarea" | "select"; required: boolean; placeholder?: string; options?: string[]; autoComplete?: string; full?: boolean; maxLength?: number }
export interface FormContent { type: FormType; eyebrow: string; title: string; introduction: string; sideNote: string; formTitle: string; submitLabel: string; successTitle: string; successBody: string; fields: FormField[] }

export const forms: Record<FormType, FormContent> = {
  contact: {
    type: "contact", eyebrow: "CONTACT NEXACT", title: "Let's start a conversation.",
    introduction: "Tell us what is on your mind. Share a question, an opportunity, or an idea worth exploring.",
    sideNote: "A direct line to the NexAct team.", formTitle: "Send an enquiry", submitLabel: "Send Message",
    successTitle: "Your message has been received.", successBody: "Your enquiry was saved successfully. The NexAct team can follow up using the details you provided.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, autoComplete: "name", maxLength: 120 },
      { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", maxLength: 254 },
      { name: "phone", label: "Phone", type: "tel", required: false, autoComplete: "tel", maxLength: 40 },
      { name: "company", label: "Company", type: "text", required: false, autoComplete: "organization", maxLength: 160 },
      { name: "subject", label: "Subject", type: "text", required: true, full: true, maxLength: 180 },
      { name: "message", label: "Message", type: "textarea", required: true, full: true, maxLength: 5000, placeholder: "Tell us a little about your enquiry" },
    ],
  },
  "book-meeting": {
    type: "book-meeting", eyebrow: "BOOK A MEETING", title: "Let's make time for what matters.",
    introduction: "Share what you would like to discuss. We will use the details to prepare for a focused conversation.",
    sideNote: "A better conversation starts with context.", formTitle: "Meeting request", submitLabel: "Request a Meeting",
    successTitle: "Your meeting request has been received.", successBody: "Your request was saved successfully. A meeting time is not confirmed until the NexAct team follows up.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, autoComplete: "name", maxLength: 120 },
      { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", maxLength: 254 },
      { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, autoComplete: "tel", maxLength: 40 },
      { name: "company", label: "Company", type: "text", required: true, autoComplete: "organization", maxLength: 160 },
      { name: "country", label: "Country", type: "text", required: true, autoComplete: "country-name", maxLength: 120 },
      { name: "interested_in", label: "Interested in", type: "select", required: true, options: ["Services", "Solutions", "Growth Partner", "AI Consultancy", "Something else"] },
      { name: "requirement", label: "Requirement", type: "textarea", required: true, full: true, maxLength: 5000, placeholder: "What would you like to explore together?" },
    ],
  },
  "get-quote": {
    type: "get-quote", eyebrow: "GET A QUOTE", title: "Tell us what you are building.",
    introduction: "Give us a useful starting point for your project. The more context you share, the more focused our response can be.",
    sideNote: "Every strong proposal starts with a clear brief.", formTitle: "Project brief", submitLabel: "Send Project Brief",
    successTitle: "Your project brief has been received.", successBody: "Your brief was saved successfully. This is a request for a quote, not a confirmed price or commitment.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, autoComplete: "name", maxLength: 120 },
      { name: "company", label: "Company", type: "text", required: true, autoComplete: "organization", maxLength: 160 },
      { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", maxLength: 254 },
      { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", maxLength: 40 },
      { name: "country", label: "Country", type: "text", required: true, autoComplete: "country-name", maxLength: 120 },
      { name: "service_solution", label: "Service / solution", type: "select", required: true, options: ["Digital experiences", "Product engineering", "AI and automation", "Business systems", "Growth Partner", "Other / not sure yet"] },
      { name: "project_description", label: "Project description", type: "textarea", required: true, full: true, maxLength: 5000, placeholder: "What are you trying to build or solve?" },
      { name: "budget_range", label: "Budget range", type: "select", required: true, options: ["Not sure yet", "Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000–$100,000", "$100,000+"] },
      { name: "timeline", label: "Timeline", type: "select", required: true, options: ["Exploring options", "As soon as possible", "Within 1–3 months", "Within 3–6 months", "6+ months"] },
      { name: "preferred_contact", label: "Preferred contact", type: "select", required: true, options: ["Email", "Phone", "WhatsApp"] },
    ],
  },
};
