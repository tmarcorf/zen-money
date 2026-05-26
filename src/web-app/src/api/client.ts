const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7109";

function getToken(): string | null {
  return localStorage.getItem("zen_token");
}

export function setToken(token: string): void {
  localStorage.setItem("zen_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("zen_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>(`${url}${buildQueryString(params)}`),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "PUT", body: data !== undefined ? JSON.stringify(data) : undefined }),

  delete: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>(`${url}${buildQueryString(params)}`, { method: "DELETE" }),
};
