import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead Dashboard", robots: { index: false, follow: false } };
export default async function Page() {
  const user = await requireAdminPage("/admin");
  return <AdminShell email={user.email || "Admin"}><AdminDashboard /></AdminShell>;
}
