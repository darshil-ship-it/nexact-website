import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/leads/config";

export const ACCESS_COOKIE = "nexact_admin_access";
export const REFRESH_COOKIE = "nexact_admin_refresh";
const REFRESH_AGE = 60 * 60 * 24 * 30;

interface AuthUser { id: string; email?: string; email_confirmed_at?: string | null }
interface AuthTokens { access_token: string; refresh_token: string; expires_in: number }

function allowedEmails() {
  return new Set((process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

function authConfig() {
  try {
    const config = getSupabaseConfig();
    const publishable = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
    const legacyAnon = process.env.SUPABASE_ANON_KEY?.trim();
    const key = publishable || legacyAnon;
    if (!config || !key || allowedEmails().size === 0) return null;
    if (publishable && !publishable.startsWith("sb_publishable_")) return null;
    return { url: config.url, headers: { apikey: key } };
  } catch { return null; }
}

export function adminAuthConfigured() { return Boolean(authConfig()); }

export async function verifyAdminAccess(accessToken: string | undefined): Promise<AuthUser | null> {
  const config = authConfig();
  if (!config || !accessToken) return null;
  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const user: AuthUser = await response.json();
    if (!user.id || !user.email || !user.email_confirmed_at || !allowedEmails().has(user.email.toLowerCase())) return null;
    return user;
  } catch { return null; }
}

export async function adminFromRequest(request: NextRequest) {
  return verifyAdminAccess(request.cookies.get(ACCESS_COOKIE)?.value);
}

async function tokenRequest(grant: "password" | "refresh_token", body: Record<string, string>): Promise<AuthTokens | null> {
  const config = authConfig();
  if (!config) return null;
  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=${grant}`, {
      method: "POST",
      headers: { ...config.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const tokens: AuthTokens = await response.json();
    if (!tokens.access_token || !tokens.refresh_token || !Number.isFinite(tokens.expires_in)) return null;
    return tokens;
  } catch { return null; }
}

export async function signInAdmin(email: string, password: string) {
  if (!allowedEmails().has(email.toLowerCase())) return null;
  const tokens = await tokenRequest("password", { email, password });
  if (!tokens || !(await verifyAdminAccess(tokens.access_token))) return null;
  return tokens;
}

export async function refreshAdmin(refreshToken: string | undefined) {
  if (!refreshToken) return null;
  const tokens = await tokenRequest("refresh_token", { refresh_token: refreshToken });
  if (!tokens || !(await verifyAdminAccess(tokens.access_token))) return null;
  return tokens;
}

export function setAdminCookies(response: NextResponse, tokens: AuthTokens) {
  const base = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, { ...base, maxAge: Math.max(60, tokens.expires_in - 30) });
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, { ...base, maxAge: REFRESH_AGE });
  response.headers.set("Cache-Control", "private, no-store");
}

export function clearAdminCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store");
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export async function requireAdminPage(next: string) {
  const store = await cookies();
  const user = await verifyAdminAccess(store.get(ACCESS_COOKIE)?.value);
  if (user) return user;
  if (store.get(REFRESH_COOKIE)?.value) redirect(`/api/admin/auth/refresh?next=${encodeURIComponent(next)}`);
  redirect("/admin/login");
}
