export const leadStatuses = ["new", "contacted", "qualified", "meeting_booked", "proposal_sent", "negotiation", "won", "lost"] as const;
export type LeadStatus = typeof leadStatuses[number];
export type LeadType = "contact" | "book-meeting" | "get-quote";

export interface LeadListItem {
  id: string; name: string; company: string | null; interest: string; lead_type: LeadType;
  page_source: string; created_at: string; status: LeadStatus;
}
export interface LeadDetail extends LeadListItem {
  email: string; phone: string | null; country: string | null; message: string;
  budget: string | null; timeline: string | null; preferred_contact: string | null;
  section_source: string; cta_source: string; referrer: string;
  utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string; utm_term: string;
  notes: string | null; next_follow_up: string | null; updated_at: string;
}
export interface LeadSummary { newLeads: number; meetings: number; quotes: number; contacts: number; won: number }
