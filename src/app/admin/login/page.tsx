import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/admin-login";
import { ACCESS_COOKIE, REFRESH_COOKIE, adminAuthConfigured, verifyAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };
export default async function Page() {
  const store = await cookies();
  if (await verifyAdminAccess(store.get(ACCESS_COOKIE)?.value)) redirect("/admin");
  if (store.get(REFRESH_COOKIE)?.value) redirect("/api/admin/auth/refresh?next=%2Fadmin");
  return <AdminLogin configured={adminAuthConfigured()} />;
}
