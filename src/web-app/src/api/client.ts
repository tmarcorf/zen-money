const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7109";

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

interface RequestOptions extends RequestInit {
  /** When true, a 401 response will NOT trigger the global logout redirect.
   *  Use this for the initial session check (/me) so we can handle it gracefully. */
  skipAuthRedirect?: boolean;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRedirect, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...fetchOptions,
    headers,
    // Send the HttpOnly auth cookie automatically
    credentials: "include",
  });

  if (res.status === 401 && !skipAuthRedirect) {
    // Dispatch a custom event so the auth context can react and redirect
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(`${url}${buildQueryString(params)}`, options),

  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),

  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body: data !== undefined ? JSON.stringify(data) : undefined }),

  delete: <T>(url: string, params?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(`${url}${buildQueryString(params)}`, { ...options, method: "DELETE" }),
};
