import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLeadDetail } from "@/components/admin/admin-lead-detail";
import { isUuid } from "@/lib/admin/leads";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead Details", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const user = await requireAdminPage(`/admin/leads/${id}`);
  return <AdminShell email={user.email || "Admin"}><AdminLeadDetail id={id} /></AdminShell>;
}
