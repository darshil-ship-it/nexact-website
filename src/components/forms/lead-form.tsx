"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import type { FormContent, FormField } from "@/content/forms";
import type { Attribution } from "@/lib/leads/validation";
import { CTA_STORAGE_KEY, UTM_KEYS, UTM_STORAGE_KEY } from "./attribution-capture";
import { trackEvent } from "@/lib/analytics";

interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi } }

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function readAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  let utm: Record<string, string> = {};
  let cta: Record<string, string> = {};
  try { const value: unknown = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}"); if (value && typeof value === "object" && !Array.isArray(value)) utm = value as Record<string, string>; } catch { /* Storage may be unavailable. */ }
  try { const value: unknown = JSON.parse(sessionStorage.getItem(CTA_STORAGE_KEY) || "{}"); if (value && typeof value === "object" && !Array.isArray(value)) cta = value as Record<string, string>; } catch { /* Storage may be unavailable. */ }
  if (cta.destination !== window.location.pathname) cta = {};
  const storedString = (source: Record<string, string>, key: string) => typeof source[key] === "string" ? source[key] : "";
  const referrer = document.referrer;
  let source = window.location.pathname;
  try { if (referrer && new URL(referrer).origin === window.location.origin) source = new URL(referrer).pathname; } catch { /* Ignore malformed referrers. */ }
  const attribution: Attribution = {
    page_source: params.get("page_source") || storedString(cta, "page_source") || source,
    section_source: params.get("section_source") || storedString(cta, "section_source") || params.get("area") || "direct",
    cta_source: params.get("cta_source") || storedString(cta, "cta_source") || (params.get("intent") === "updates" ? "Get Notified" : "direct"),
    referrer,
    utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", utm_term: "",
  };
  for (const key of UTM_KEYS) attribution[key] = params.get(key) || storedString(utm, key);
  return attribution;
}

function Field({ field, formId, error }: { field: FormField; formId: string; error?: string }) {
  const id = `${formId}-${field.name}`;
  const common = { id, name: field.name, required: field.required, maxLength: field.maxLength, "aria-invalid": error ? true as const : undefined, "aria-describedby": error ? `${id}-error` : undefined };
  return <div className={`lead-field${field.full ? " lead-field--full" : ""}`}>
    <label htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
    {field.type === "textarea" ? <textarea {...common} rows={5} placeholder={field.placeholder} minLength={10} /> : field.type === "select" ? <select {...common} defaultValue=""><option value="" disabled>Select an option</option>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input {...common} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} minLength={field.type === "text" ? 2 : undefined} inputMode={field.type === "tel" ? "tel" : undefined} />}
    {error && <p id={`${id}-error`} className="lead-field__error">{error}</p>}
  </div>;
}

export function LeadForm({ content }: { content: FormContent }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeError, setChallengeError] = useState("");
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !challengeRef.current) return;
    let active = true;
    function mount() {
      if (!active || !window.turnstile || !challengeRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(challengeRef.current, {
        sitekey: siteKey,
        callback: (token: string) => { setChallengeToken(token); setChallengeError(""); },
        "expired-callback": () => setChallengeToken(""),
        "error-callback": () => { setChallengeToken(""); setChallengeError("Spam check could not load. Please try again."); },
      });
    }
    if (window.turnstile) mount();
    else {
      let script = document.querySelector<HTMLScriptElement>('script[data-nexact-turnstile]');
      if (!script) {
        script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.nexactTurnstile = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
      script.addEventListener("error", () => setChallengeError("Spam check could not load. Please try again."));
    }
    return () => { active = false; if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current); widgetIdRef.current = null; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setError(""); setFieldErrors({});
    if (siteKey && !challengeToken) { setChallengeError("Complete the spam check before sending."); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(content.fields.map(({ name }) => [name, String(data.get(name) || "")])) as Record<string, string>;
    const attribution = readAttribution();
    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: content.type, fields, attribution, turnstile_token: challengeToken, website: data.get("website") || "" }),
      });
      const result = await response.json() as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors || {});
        setError(result.error || "We could not save your request. Please try again.");
        setStatus("idle");
        if (widgetIdRef.current) { window.turnstile?.reset(widgetIdRef.current); setChallengeToken(""); }
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      setStatus("success");
      const submitEvent = content.type === "contact" ? "contact_submit" : content.type === "book-meeting" ? "meeting_submit" : "quote_submit";
      trackEvent(submitEvent, { page_source: attribution.page_source, section_source: attribution.section_source, cta_source: attribution.cta_source });
      form.reset();
    } catch {
      setError("The request could not be sent. Check your connection and try again.");
      setStatus("idle");
      if (widgetIdRef.current) { window.turnstile?.reset(widgetIdRef.current); setChallengeToken(""); }
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  return <div className={`lead-page lead-page--${content.type}`}><div className="container lead-page__layout">
    <div className="lead-page__intro"><p className="lead-page__eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p className="lead-page__description">{content.introduction}</p><div className="lead-page__side-note"><span aria-hidden="true">↗</span><p>{content.sideNote}</p></div></div>
    <div className="lead-card">{status === "success" ? <div className="lead-success" role="status"><span className="lead-success__icon"><Check size={30} aria-hidden="true" /></span><p className="lead-page__eyebrow">SUBMISSION RECEIVED</p><h2>{content.successTitle}</h2><p>{content.successBody}</p><button type="button" className="lead-success__again" onClick={() => setStatus("idle")}>Send another request <ArrowUpRight size={16} aria-hidden="true" /></button></div> : <form onSubmit={submit}>
      <div className="lead-card__head"><h2>{content.formTitle}</h2><p>Fields marked <span aria-hidden="true">*</span> are required.</p></div>
      {error && <div className="lead-form-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
      <div className="lead-fields">{content.fields.map((field) => <Field field={field} formId={content.type} error={fieldErrors[field.name]} key={field.name} />)}</div>
      <div className="lead-honeypot" aria-hidden="true"><label htmlFor={`${content.type}-website`}>Website</label><input id={`${content.type}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
      {siteKey && <div className="lead-challenge"><div ref={challengeRef} />{challengeError && <p role="alert">{challengeError}</p>}</div>}
      <button className="lead-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? <><LoaderCircle size={18} className="lead-spin" aria-hidden="true" /> Sending…</> : <>{content.submitLabel}<ArrowUpRight size={18} aria-hidden="true" /></>}</button>
      <p className="lead-card__footnote">Your details are used to respond to this request.</p>
    </form>}</div>
  </div></div>;
}
