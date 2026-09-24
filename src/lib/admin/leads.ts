import "server-only";
import { getSupabaseConfig } from "@/lib/leads/config";
import type { LeadDetail, LeadListItem, LeadStatus, LeadType, LeadSummary } from "@/types/admin";

function config() {
  const value = getSupabaseConfig();
  if (!value) throw new Error("Supabase is not configured.");
  return value;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const { url, headers } = config();
  const response = await fetch(`${url}/rest/v1/leads${path}`, {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Supabase leads request failed with status ${response.status}.`);
  return response;
}

function countFromRange(response: Response) {
  const total = response.headers.get("content-range")?.split("/")[1];
  const count = Number(total);
  if (!total || !Number.isFinite(count)) throw new Error("Supabase count header is unavailable.");
  return count;
}

async function countLeads(filter: string) {
  const response = await supabaseRequest(`?select=id&${filter}`, { method: "HEAD", headers: { Prefer: "count=exact" } });
  return countFromRange(response);
}

export async function listLeads(page: number, status?: LeadStatus, leadType?: LeadType) {
  const params = new URLSearchParams({ select: "id,name,company,interest,lead_type,page_source,created_at,status", order: "created_at.desc", limit: "30", offset: String((page - 1) * 30) });
  if (status) params.set("status", `eq.${status}`);
  if (leadType) params.set("lead_type", `eq.${leadType}`);
  const [response, newLeads, meetings, quotes, contacts, won] = await Promise.all([
    supabaseRequest(`?${params}`, { headers: { Prefer: "count=exact" } }),
    countLeads("status=eq.new"), countLeads("lead_type=eq.book-meeting"),
    countLeads("lead_type=eq.get-quote"), countLeads("lead_type=eq.contact"), countLeads("status=eq.won"),
  ]);
  return {
    items: await response.json() as LeadListItem[],
    total: countFromRange(response),
    page,
    pageSize: 30,
    summary: { newLeads, meetings, quotes, contacts, won } satisfies LeadSummary,
  };
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  const response = await supabaseRequest(`?select=*&id=eq.${id}&limit=1`);
  const rows = await response.json() as LeadDetail[];
  return rows[0] || null;
}

export async function updateLead(id: string, changes: Partial<Pick<LeadDetail, "status" | "notes" | "next_follow_up">>): Promise<LeadDetail | null> {
  const response = await supabaseRequest(`?id=eq.${id}&select=*`, {
    method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(changes),
  });
  const rows = await response.json() as LeadDetail[];
  return rows[0] || null;
}

export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
