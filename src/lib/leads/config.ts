import "server-only";

export interface SupabaseConfig { url: string; headers: Record<string, string> }

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  const legacyKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const key = secretKey || legacyKey;
  if (!url && !key) return null;
  if (!url || !key) throw new Error("SUPABASE_URL and a server-side Supabase key must be configured together.");
  if (secretKey && !secretKey.startsWith("sb_secret_")) throw new Error("SUPABASE_SECRET_KEY must be a Supabase secret key.");
  if (key.startsWith("sb_publishable_") || key.startsWith("sb_anon_")) throw new Error("A publishable key cannot be used for lead storage.");
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error("SUPABASE_URL is not a valid URL."); }
  if (parsed.protocol !== "https:" && !(process.env.NODE_ENV === "development" && parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
    throw new Error("SUPABASE_URL must use HTTPS outside local development.");
  }
  const headers: Record<string, string> = { apikey: key };
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
  return { url: parsed.toString().replace(/\/+$/, ""), headers };
}
