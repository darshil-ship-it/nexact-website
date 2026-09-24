import { forms, type FieldName, type FormType } from "@/content/forms";

export interface Attribution {
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
export interface LeadSubmission { form_type: FormType; fields: Partial<Record<FieldName, string>>; attribution: Attribution }
export type ValidationResult = { ok: true; value: LeadSubmission; turnstileToken: string } | { ok: false; errors: Record<string, string> };

const attributionKeys: (keyof Attribution)[] = ["page_source", "section_source", "cta_source", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, errors: { form: "Invalid submission." } };
  const source = input as Record<string, unknown>;
  const formType = source.form_type;
  if (formType !== "contact" && formType !== "book-meeting" && formType !== "get-quote") return { ok: false, errors: { form: "Unknown form." } };
  if (typeof source.website === "string" && source.website.trim()) return { ok: false, errors: { form: "Submission could not be accepted." } };
  const submittedFields = source.fields && typeof source.fields === "object" && !Array.isArray(source.fields) ? source.fields as Record<string, unknown> : {};
  const fields: Partial<Record<FieldName, string>> = {};
  const errors: Record<string, string> = {};

  for (const field of forms[formType].fields) {
    const raw = submittedFields[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      if (field.required) errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (value.length > (field.maxLength ?? 120)) { errors[field.name] = `${field.label} is too long.`; continue; }
    if (field.type === "email" && !emailPattern.test(value)) { errors[field.name] = "Enter a valid email address."; continue; }
    if (field.type === "tel" && (value.replace(/\D/g, "").length < 7 || !/^[\d+().\s-]+$/.test(value))) { errors[field.name] = "Enter a valid phone number."; continue; }
    if (field.type === "select" && !field.options?.includes(value)) { errors[field.name] = "Select a valid option."; continue; }
    if ((field.type === "textarea" && value.length < 10) || (field.type === "text" && value.length < 2)) { errors[field.name] = `${field.label} is too short.`; continue; }
    fields[field.name] = value;
  }

  const suppliedAttribution = source.attribution && typeof source.attribution === "object" && !Array.isArray(source.attribution) ? source.attribution as Record<string, unknown> : {};
  const attribution = {} as Attribution;
  for (const key of attributionKeys) {
    const raw = suppliedAttribution[key];
    attribution[key] = typeof raw === "string" ? raw.trim().slice(0, key === "referrer" ? 2048 : 256) : "";
  }
  const token = typeof source.turnstile_token === "string" ? source.turnstile_token.slice(0, 2048) : "";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { form_type: formType, fields, attribution }, turnstileToken: token };
}
