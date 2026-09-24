import { NextRequest, NextResponse } from "next/server";
import { REFRESH_COOKIE, clearAdminCookies, refreshAdmin, sameOrigin, setAdminCookies } from "@/lib/admin/auth";

export const runtime = "nodejs";
const safeNext = (value: string | null) => value && /^\/admin(?:\/|$)/.test(value) && !value.startsWith("//") ? value : "/admin";

export async function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const tokens = await refreshAdmin(request.cookies.get(REFRESH_COOKIE)?.value);
  const response = NextResponse.redirect(new URL(tokens ? next : "/admin/login", request.url));
  if (tokens) setAdminCookies(response, tokens); else clearAdminCookies(response);
  return response;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const tokens = await refreshAdmin(request.cookies.get(REFRESH_COOKIE)?.value);
  const response = NextResponse.json(tokens ? { ok: true } : { error: "Session expired." }, { status: tokens ? 200 : 401 });
  if (tokens) setAdminCookies(response, tokens); else clearAdminCookies(response);
  return response;
}
