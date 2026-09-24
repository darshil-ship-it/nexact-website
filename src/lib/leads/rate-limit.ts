import "server-only";
import { createHash, createHmac } from "node:crypto";
import { getSupabaseConfig } from "./config";

const WINDOW_SECONDS = 15 * 60;
const IP_MAX = 10;
const EMAIL_MAX = 3;
const localBuckets = new Map<string, { count: number; expiresAt: number }>();

export class RateLimitUnavailableError extends Error {}
export type RateLimitResult = { allowed: true } | { allowed: false; retryAfter: number };

function clientIp(headers: Headers): string | null {
  const direct = headers.get("cf-connecting-ip") || headers.get("x-real-ip");
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = (direct || forwarded || "").trim();
  return value && value.length <= 64 ? value : null;
}

function localConsume(actor: string, max: number): RateLimitResult {
  const now = Date.now();
  const windowStart = Math.floor(now / (WINDOW_SECONDS * 1000)) * WINDOW_SECONDS * 1000;
  const key = `${actor}:${windowStart}`;
  const entry = localBuckets.get(key) || { count: 0, expiresAt: windowStart + WINDOW_SECONDS * 1000 };
  entry.count += 1;
  localBuckets.set(key, entry);
  if (localBuckets.size > 2000) for (const [bucketKey, bucket] of localBuckets) if (bucket.expiresAt < now) localBuckets.delete(bucketKey);
  return entry.count <= max ? { allowed: true } : { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)) };
}

async function supabaseConsume(actorHash: string, max: number, url: string, headers: Record<string, string>): Promise<RateLimitResult> {
  let response: Response;
  try {
    response = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/rpc/consume_lead_rate_limit`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ p_actor_hash: actorHash, p_window_seconds: WINDOW_SECONDS, p_max_requests: max }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Rate limit RPC returned ${response.status}`);
    const allowed: unknown = await response.json();
    if (typeof allowed !== "boolean") throw new Error("Rate limit RPC returned an invalid response");
    const retryAfter = WINDOW_SECONDS - (Math.floor(Date.now() / 1000) % WINDOW_SECONDS);
    return allowed ? { allowed: true } : { allowed: false, retryAfter };
  } catch (error) {
    throw new RateLimitUnavailableError(error instanceof Error ? error.message : "Rate limit RPC failed");
  }
}

async function consumeActors(actors: { value: string; max: number }[]): Promise<RateLimitResult> {
  const config = getSupabaseConfig();
  const secret = process.env.LEAD_RATE_LIMIT_SECRET?.trim();
  if (config) {
    if (!secret || secret.length < 32) throw new RateLimitUnavailableError("LEAD_RATE_LIMIT_SECRET must contain at least 32 characters.");
    for (const actor of actors) {
      const hash = createHmac("sha256", secret).update(actor.value).digest("hex");
      const result = await supabaseConsume(hash, actor.max, config.url, config.headers);
      if (!result.allowed) return result;
    }
    return { allowed: true };
  }
  if (process.env.NODE_ENV !== "development") throw new RateLimitUnavailableError("Production rate limiting is not configured.");
  for (const actor of actors) {
    const hash = createHash("sha256").update(actor.value).digest("hex");
    const result = localConsume(hash, actor.max);
    if (!result.allowed) return result;
  }
  return { allowed: true };
}

export function checkLeadRateLimit(headers: Headers, email: string): Promise<RateLimitResult> {
  const actors = [{ value: `lead-email:${email.toLowerCase()}`, max: EMAIL_MAX }];
  const ip = clientIp(headers);
  if (ip) actors.unshift({ value: `lead-ip:${ip}`, max: IP_MAX });
  return consumeActors(actors);
}

export function checkAdminLoginRateLimit(headers: Headers, email: string): Promise<RateLimitResult> {
  const actors = [{ value: `admin-email:${email.toLowerCase()}`, max: 5 }];
  const ip = clientIp(headers);
  if (ip) actors.unshift({ value: `admin-ip:${ip}`, max: 10 });
  return consumeActors(actors);
}
