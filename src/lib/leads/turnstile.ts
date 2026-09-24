import "server-only";

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<"ok" | "invalid" | "unavailable"> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!secret && !siteKey) return "ok";
  if (!secret || !siteKey) return "unavailable";
  if (!token) return "invalid";
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) return "unavailable";
    const result: unknown = await response.json();
    return result && typeof result === "object" && "success" in result && result.success === true ? "ok" : "invalid";
  } catch {
    return "unavailable";
  }
}
