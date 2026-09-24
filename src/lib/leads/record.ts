import type { LeadSubmission } from "./validation";

export interface LeadRecordInput {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  interest: string;
  message: string;
  budget: string | null;
  timeline: string | null;
  preferred_contact: string | null;
  lead_type: LeadSubmission["form_type"];
  page_source: string;
  section_source: string;
  cta_source: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export function toLeadRecord(submission: LeadSubmission): LeadRecordInput {
  const { fields, attribution, form_type } = submission;
  return {
    name: fields.name!,
    email: fields.email!,
    phone: fields.phone || null,
    company: fields.company || null,
    country: fields.country || null,
    interest: fields.subject || fields.interested_in || fields.service_solution || "",
    message: fields.message || fields.requirement || fields.project_description || "",
    budget: fields.budget_range || null,
    timeline: fields.timeline || null,
    preferred_contact: fields.preferred_contact || null,
    lead_type: form_type,
    ...attribution,
  };
}
