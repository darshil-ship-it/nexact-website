import { NextRequest, NextResponse } from "next/server";
import { validateLead } from "@/lib/leads/validation";
import { persistLead } from "@/lib/leads/adapter";
import { verifyTurnstile } from "@/lib/leads/turnstile";
import { checkLeadRateLimit } from "@/lib/leads/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Unsupported request format." }, { status: 415 });
  const reportedLength = Number(request.headers.get("content-length") || 0);
  if (reportedLength > 20000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 20000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch { return NextResponse.json({ error: "Invalid submission." }, { status: 400 }); }
  const validated = validateLead(body);
  if (!validated.ok) return NextResponse.json({ error: "Please review the highlighted fields.", fieldErrors: validated.errors }, { status: 400 });

  try {
    const limit = await checkLeadRateLimit(request.headers, validated.value.fields.email!);
    if (!limit.allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  } catch (error) {
    console.error("Lead rate limiting failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "The form is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const challenge = await verifyTurnstile(validated.turnstileToken, request.headers.get("cf-connecting-ip") || undefined);
  if (challenge === "invalid") return NextResponse.json({ error: "Please complete the spam check and try again." }, { status: 400 });
  if (challenge === "unavailable") return NextResponse.json({ error: "Spam protection is temporarily unavailable. Please try again later." }, { status: 503 });

  try {
    await persistLead(validated.value);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Lead persistence failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We could not save your request. Please try again later." }, { status: 503 });
  }
}
