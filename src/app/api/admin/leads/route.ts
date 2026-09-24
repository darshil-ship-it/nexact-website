import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin/auth";
import { listLeads } from "@/lib/admin/leads";
import { leadStatuses, type LeadStatus, type LeadType } from "@/types/admin";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  if (!(await adminFromRequest(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const rawPage = request.nextUrl.searchParams.get("page") || "1";
  const page = Number(rawPage);
  const rawStatus = request.nextUrl.searchParams.get("status");
  const rawType = request.nextUrl.searchParams.get("type");
  if (!Number.isInteger(page) || page < 1 || page > 10000 || (rawStatus && !leadStatuses.includes(rawStatus as LeadStatus)) || (rawType && !["contact", "book-meeting", "get-quote"].includes(rawType))) {
    return NextResponse.json({ error: "Invalid filter." }, { status: 400 });
  }
  try {
    const result = await listLeads(page, rawStatus as LeadStatus | undefined, rawType as LeadType | undefined);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin leads list failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Could not load leads." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
