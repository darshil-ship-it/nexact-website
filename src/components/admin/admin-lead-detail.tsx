"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react";
import { adminFetch } from "./admin-fetch";
import { leadStatuses, type LeadDetail, type LeadStatus } from "@/types/admin";

const labels: Record<LeadStatus, string> = { new: "New", contacted: "Contacted", qualified: "Qualified", meeting_booked: "Meeting Booked", proposal_sent: "Proposal Sent", negotiation: "Negotiation", won: "Won", lost: "Lost" };
const typeLabels = { contact: "Contact Request", "book-meeting": "Meeting Request", "get-quote": "Quote Request" };
const display = (value: string | null | undefined) => value || "—";
const localDateTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function AdminLeadDetail({ id }: { id: string }) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [status, setStatus] = useState<LeadStatus>("new");
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    adminFetch(`/api/admin/leads/${id}`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Lead could not be loaded.");
      const item = await response.json() as LeadDetail;
      if (!controller.signal.aborted) { setLead(item); setStatus(item.status); setNotes(item.notes || ""); setFollowUp(localDateTime(item.next_follow_up)); setLoading(false); }
    }).catch(() => { if (!controller.signal.aborted) { setError("Lead could not be loaded. Please return to the dashboard and try again."); setLoading(false); } });
    return () => controller.abort();
  }, [id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSaved(false); setSaving(true);
    const nextDate = followUp ? new Date(followUp) : null;
    if (nextDate && !Number.isFinite(nextDate.getTime())) { setError("Enter a valid follow-up date."); setSaving(false); return; }
    try {
      const response = await adminFetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, notes, next_follow_up: nextDate?.toISOString() || null }) });
      if (!response.ok) throw new Error("Changes could not be saved.");
      const updated = await response.json() as LeadDetail;
      setLead(updated); setStatus(updated.status); setNotes(updated.notes || ""); setFollowUp(localDateTime(updated.next_follow_up)); setSaved(true);
    } catch { setError("Changes could not be saved. Please try again."); }
    finally { setSaving(false); }
  }

  return <div className="admin-container admin-detail"><Link href="/admin" className="admin-back"><ArrowLeft size={17} aria-hidden="true" /> Back to leads</Link>{loading ? <div className="admin-loading" role="status">Loading lead…</div> : error && !lead ? <div className="admin-alert" role="alert">{error}</div> : lead && <><div className="admin-detail__heading"><div><p className="admin-kicker">{typeLabels[lead.lead_type]}</p><h1>{lead.name}</h1><p>{display(lead.company)} · Received {new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date(lead.created_at))}</p></div><span className={`admin-status admin-status--${lead.status}`}>{labels[lead.status]}</span></div><div className="admin-detail__grid"><div className="admin-detail__main"><section className="admin-detail-card"><h2>Request</h2><dl className="admin-info-grid"><div><dt>Interest</dt><dd>{lead.interest}</dd></div><div><dt>Lead type</dt><dd>{typeLabels[lead.lead_type]}</dd></div><div className="admin-info-grid__full"><dt>Message</dt><dd className="admin-message">{lead.message}</dd></div><div><dt>Budget</dt><dd>{display(lead.budget)}</dd></div><div><dt>Timeline</dt><dd>{display(lead.timeline)}</dd></div><div><dt>Preferred contact</dt><dd>{display(lead.preferred_contact)}</dd></div></dl></section><section className="admin-detail-card"><h2>Contact details</h2><dl className="admin-info-grid"><div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}<ArrowUpRight size={14} aria-hidden="true" /></a></dd></div><div><dt>Phone</dt><dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}<ArrowUpRight size={14} aria-hidden="true" /></a> : "—"}</dd></div><div><dt>Company</dt><dd>{display(lead.company)}</dd></div><div><dt>Country</dt><dd>{display(lead.country)}</dd></div></dl></section><section className="admin-detail-card"><h2>Source and campaign</h2><dl className="admin-info-grid"><div><dt>Source page</dt><dd>{display(lead.page_source)}</dd></div><div><dt>Source section</dt><dd>{display(lead.section_source)}</dd></div><div><dt>Source CTA</dt><dd>{display(lead.cta_source)}</dd></div><div><dt>Referrer</dt><dd className="admin-break">{display(lead.referrer)}</dd></div><div><dt>UTM source</dt><dd>{display(lead.utm_source)}</dd></div><div><dt>UTM medium</dt><dd>{display(lead.utm_medium)}</dd></div><div><dt>UTM campaign</dt><dd>{display(lead.utm_campaign)}</dd></div><div><dt>UTM content</dt><dd>{display(lead.utm_content)}</dd></div><div><dt>UTM term</dt><dd>{display(lead.utm_term)}</dd></div></dl></section></div><aside className="admin-detail-card admin-detail__edit"><h2>Manage lead</h2><form onSubmit={save}><label htmlFor="lead-status">Status</label><select id="lead-status" value={status} onChange={(event) => { setStatus(event.target.value as LeadStatus); setSaved(false); }}>{leadStatuses.map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select><label htmlFor="lead-follow-up">Next follow-up</label><input id="lead-follow-up" type="datetime-local" value={followUp} onChange={(event) => { setFollowUp(event.target.value); setSaved(false); }} /><label htmlFor="lead-notes">Internal notes</label><textarea id="lead-notes" rows={9} maxLength={10000} value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} placeholder="Add context for the team" />{error && <p className="admin-error" role="alert">{error}</p>}{saved && <p className="admin-saved" role="status">Changes saved.</p>}<button type="submit" disabled={saving}>{saving ? <><LoaderCircle size={17} className="admin-spin" aria-hidden="true" /> Saving…</> : "Save changes"}</button></form><p className="admin-detail__updated">Last updated {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.updated_at))}</p></aside></div></>}</div>;
}
