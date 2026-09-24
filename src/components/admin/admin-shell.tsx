"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  async function signOut() {
    try { await fetch("/api/admin/auth/logout", { method: "POST" }); } finally { window.location.replace("/admin/login"); }
  }
  return <div className="admin-page"><header className="admin-topbar"><div className="admin-container admin-topbar__inner"><Link href="/admin" className="admin-brand"><span>NexAct</span><small>LEADS</small></Link><div className="admin-topbar__right"><span className="admin-email">{email}</span><button type="button" onClick={signOut} aria-label="Sign out"><LogOut size={17} aria-hidden="true" /><span>Sign out</span></button></div></div></header>{children}</div>;
}
