"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { adminFetch } from "./admin-fetch";
import { leadStatuses, type LeadListItem, type LeadStatus, type LeadSummary, type LeadType } from "@/types/admin";

interface LeadPage { items: LeadListItem[]; total: number; page: number; pageSize: number; summary: LeadSummary }
const labels: Record<LeadStatus, string> = { new: "New", contacted: "Contacted", qualified: "Qualified", meeting_booked: "Meeting Booked", proposal_sent: "Proposal Sent", negotiation: "Negotiation", won: "Won", lost: "Lost" };
const typeLabels: Record<LeadType, string> = { contact: "Contact", "book-meeting": "Meeting", "get-quote": "Quote" };
const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));

export function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [data, setData] = useState<LeadPage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    adminFetch(`/api/admin/leads?${params}`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Lead data could not be loaded.");
      const value = await response.json() as LeadPage;
      if (!controller.signal.aborted) { setData(value); setError(""); setLoading(false); }
    }).catch(() => { if (!controller.signal.aborted) { setError("Lead data could not be loaded. Please try again."); setLoading(false); } });
    return () => controller.abort();
  }, [page, status, type, revision]);

  function filter(nextStatus = "", nextType = "") { setStatus(nextStatus); setType(nextType); setPage(1); setLoading(true); }
  const cards = data ? [
    { label: "New Leads", value: data.summary.newLeads, status: "new", type: "" },
    { label: "Meetings", value: data.summary.meetings, status: "", type: "book-meeting" },
    { label: "Quotes", value: data.summary.quotes, status: "", type: "get-quote" },
    { label: "Contact Requests", value: data.summary.contacts, status: "", type: "contact" },
    { label: "Won Clients", value: data.summary.won, status: "won", type: "" },
  ] : [];

  return <div className="admin-container admin-dashboard"><div className="admin-heading"><div><p className="admin-kicker">NEXACT / LEAD MANAGEMENT</p><h1>Lead dashboard</h1><p>Review enquiries, track progress, and plan your next follow-up.</p></div><button className="admin-refresh" type="button" onClick={() => { setLoading(true); setRevision((value) => value + 1); }}><RefreshCw size={16} aria-hidden="true" /> Refresh</button></div>
    {data && <div className="admin-stats">{cards.map((card) => <button type="button" className="admin-stat" key={card.label} onClick={() => filter(card.status, card.type)}><span>{card.label}</span><strong>{card.value}</strong><ArrowRight size={17} aria-hidden="true" /></button>)}</div>}
    <section className="admin-panel" aria-labelledby="admin-leads-heading"><div className="admin-panel__head"><div><p className="admin-kicker">INBOX</p><h2 id="admin-leads-heading">Leads {data && <span>{data.total}</span>}</h2></div><div className="admin-filters"><label>Status<select value={status} onChange={(event) => filter(event.target.value, type)}><option value="">All statuses</option>{leadStatuses.map((value) => <option value={value} key={value}>{labels[value]}</option>)}</select></label><label>Type<select value={type} onChange={(event) => filter(status, event.target.value)}><option value="">All types</option><option value="contact">Contact</option><option value="book-meeting">Meeting</option><option value="get-quote">Quote</option></select></label></div></div>
      {error && <div className="admin-alert" role="alert">{error}<button type="button" onClick={() => { setLoading(true); setRevision((value) => value + 1); }}>Retry</button></div>}
      {loading && <div className="admin-loading" role="status">Loading leads…</div>}
      {!loading && !error && data && (data.items.length ? <><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Company</th><th>Interest</th><th>Lead type</th><th>Source</th><th>Created</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{data.items.map((lead) => <tr key={lead.id}><td><Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link></td><td>{lead.company || "—"}</td><td>{lead.interest}</td><td>{typeLabels[lead.lead_type]}</td><td>{lead.page_source || "—"}</td><td>{date(lead.created_at)}</td><td><span className={`admin-status admin-status--${lead.status}`}>{labels[lead.status]}</span></td><td><Link href={`/admin/leads/${lead.id}`} aria-label={`Open ${lead.name}`}><ArrowRight size={17} /></Link></td></tr>)}</tbody></table></div><div className="admin-mobile-list">{data.items.map((lead) => <Link className="admin-mobile-lead" href={`/admin/leads/${lead.id}`} key={lead.id}><div><strong>{lead.name}</strong><span className={`admin-status admin-status--${lead.status}`}>{labels[lead.status]}</span></div><p>{lead.company || typeLabels[lead.lead_type]} · {lead.interest}</p><small>{typeLabels[lead.lead_type]} · {date(lead.created_at)}</small><ArrowRight size={18} aria-hidden="true" /></Link>)}</div><div className="admin-pagination"><span>{(page - 1) * data.pageSize + 1}–{Math.min(page * data.pageSize, data.total)} of {data.total}</span><div><button type="button" onClick={() => { setPage((value) => value - 1); setLoading(true); }} disabled={page <= 1} aria-label="Previous page"><ChevronLeft size={18} /></button><button type="button" onClick={() => { setPage((value) => value + 1); setLoading(true); }} disabled={page * data.pageSize >= data.total} aria-label="Next page"><ChevronRight size={18} /></button></div></div></> : <div className="admin-empty">No leads match these filters.</div>)}
    </section>
  </div>;
}
