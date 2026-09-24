import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { LeadSubmission } from "./validation";
import { toLeadRecord } from "./record";
import { getSupabaseConfig } from "./config";

export class PersistenceUnavailableError extends Error {}

export async function persistLead(submission: LeadSubmission): Promise<void> {
  const config = getSupabaseConfig();
  const record = toLeadRecord(submission);
  if (config) {
    const endpoint = `${config.url}/rest/v1/leads`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { ...config.headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(record),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new PersistenceUnavailableError(`Supabase insert failed with status ${response.status}.`);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    const directory = join(process.cwd(), ".local");
    await mkdir(directory, { recursive: true });
    const now = new Date().toISOString();
    await appendFile(join(directory, "leads.jsonl"), JSON.stringify({ id: randomUUID(), ...record, status: "new", notes: null, next_follow_up: null, created_at: now, updated_at: now }) + "\n", { encoding: "utf8" });
    return;
  }
  throw new PersistenceUnavailableError("No production lead persistence is configured.");
}
