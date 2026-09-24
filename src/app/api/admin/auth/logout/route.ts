import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookies, sameOrigin } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  clearAdminCookies(response);
  return response;
}
