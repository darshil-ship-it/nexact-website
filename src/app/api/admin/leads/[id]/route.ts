import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest, sameOrigin } from "@/lib/admin/auth";
import { getLead, isUuid, updateLead } from "@/lib/admin/leads";
import { leadStatuses, type LeadStatus } from "@/types/admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest, context: Context) {
  if (!(await adminFromRequest(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: privateHeaders });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid lead ID." }, { status: 400, headers: privateHeaders });
  try {
    const lead = await getLead(id);
    return lead ? NextResponse.json(lead, { headers: privateHeaders }) : NextResponse.json({ error: "Lead not found." }, { status: 404, headers: privateHeaders });
  } catch (error) {
    console.error("Admin lead detail failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Could not load lead." }, { status: 503, headers: privateHeaders });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers: privateHeaders });
  if (!(await adminFromRequest(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: privateHeaders });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid lead ID." }, { status: 400, headers: privateHeaders });
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 12000) return NextResponse.json({ error: "Update is too large." }, { status: 413, headers: privateHeaders });
    raw = JSON.parse(text);
  } catch { return NextResponse.json({ error: "Invalid update." }, { status: 400, headers: privateHeaders }); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Invalid update." }, { status: 400, headers: privateHeaders });
  const input = raw as Record<string, unknown>;
  const keys = Object.keys(input);
  if (!keys.length || keys.some((key) => !["status", "notes", "next_follow_up"].includes(key))) return NextResponse.json({ error: "Unsupported update field." }, { status: 400, headers: privateHeaders });
  const changes: { status?: LeadStatus; notes?: string | null; next_follow_up?: string | null } = {};
  if ("status" in input) {
    if (typeof input.status !== "string" || !leadStatuses.includes(input.status as LeadStatus)) return NextResponse.json({ error: "Invalid status." }, { status: 400, headers: privateHeaders });
    changes.status = input.status as LeadStatus;
  }
  if ("notes" in input) {
    if (input.notes !== null && (typeof input.notes !== "string" || input.notes.length > 10000)) return NextResponse.json({ error: "Notes must be 10,000 characters or less." }, { status: 400, headers: privateHeaders });
    changes.notes = typeof input.notes === "string" ? input.notes.trim() || null : null;
  }
  if ("next_follow_up" in input) {
    if (input.next_follow_up !== null && (typeof input.next_follow_up !== "string" || !Number.isFinite(Date.parse(input.next_follow_up)))) return NextResponse.json({ error: "Invalid follow-up date." }, { status: 400, headers: privateHeaders });
    changes.next_follow_up = typeof input.next_follow_up === "string" ? new Date(input.next_follow_up).toISOString() : null;
  }
  try {
    const lead = await updateLead(id, changes);
    return lead ? NextResponse.json(lead, { headers: privateHeaders }) : NextResponse.json({ error: "Lead not found." }, { status: 404, headers: privateHeaders });
  } catch (error) {
    console.error("Admin lead update failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Could not save changes." }, { status: 503, headers: privateHeaders });
  }
}
