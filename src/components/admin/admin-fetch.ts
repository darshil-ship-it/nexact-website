export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  let response = await fetch(path, { ...init, cache: "no-store" });
  if (response.status !== 401) return response;
  const refresh = await fetch("/api/admin/auth/refresh", { method: "POST", cache: "no-store" });
  if (!refresh.ok) {
    window.location.replace("/admin/login");
    return response;
  }
  response = await fetch(path, { ...init, cache: "no-store" });
  return response;
}
