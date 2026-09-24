import { NextRequest, NextResponse } from "next/server";
import { adminAuthConfigured, sameOrigin, setAdminCookies, signInAdmin } from "@/lib/admin/auth";
import { checkAdminLoginRateLimit } from "@/lib/leads/rate-limit";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!adminAuthConfigured()) return NextResponse.json({ error: "Admin sign-in is not configured." }, { status: 503 });
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 5000) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!input || typeof input !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { email, password } = input as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 1024 || !email.includes("@") || !password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }
  try {
    const limit = await checkAdminLoginRateLimit(request.headers, email);
    if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  } catch { return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 }); }
  const tokens = await signInAdmin(email.trim(), password);
  if (!tokens) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  setAdminCookies(response, tokens);
  return response;
}
