"use client";
import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        setError(result.error || "Sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      window.location.replace("/admin");
    } catch { setError("Sign-in is temporarily unavailable."); setLoading(false); }
  }

  return <div className="admin-page admin-login-page"><div className="admin-login"><div className="admin-login__brand"><span>NexAct</span><small>PRIVATE WORKSPACE</small></div><p className="admin-kicker">ADMIN ACCESS</p><h1>Welcome back.</h1><p className="admin-login__intro">Sign in to manage NexAct enquiries and follow-ups.</p>{configured ? <form onSubmit={submit}><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required /><label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required />{error && <p className="admin-error" role="alert">{error}</p>}<button type="submit" disabled={loading}>{loading ? <><LoaderCircle size={17} className="admin-spin" aria-hidden="true" /> Signing in…</> : <>Sign in <ArrowUpRight size={17} aria-hidden="true" /></>}</button></form> : <p className="admin-error" role="status">Admin sign-in has not been configured yet.</p>}</div></div>;
}
