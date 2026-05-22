const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7109";

function getToken(): string | null {
  return localStorage.getItem("zen_token");
}

export function setToken(token: string) {
  localStorage.setItem("zen_token", token);
}

export function removeToken() {
  localStorage.removeItem("zen_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getStoredUser() {
  const u = localStorage.getItem("zen_user");
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user: any) {
  localStorage.setItem("zen_user", JSON.stringify(user));
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}

function buildQuery(params?: PaginationParams): string {
  if (!params) return "";
  const parts: string[] = [];
  if (params.skip !== undefined) parts.push(`skip=${params.skip}`);
  if (params.take !== undefined) parts.push(`take=${params.take}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: any) => request<T>(url, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(url: string, data?: any) => request<T>(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

// Dashboard
export const dashboardApi = {
  get: () => api.get<any>("/api/dashboards"),
};

// Categories
export const categoryApi = {
  list: (params?: PaginationParams) => api.get<any>(`/api/categories/list-paginated${buildQuery(params)}`),
  create: (data: any) => api.post<any>("/api/categories", data),
  update: (id: string, data: any) => api.put<any>(`/api/categories/${id}`, data),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

// Expenses
export const expenseApi = {
  list: (params?: PaginationParams) => api.get<any>(`/api/expense${buildQuery(params)}`),
  create: (data: any) => api.post<any>("/api/expense", data),
  update: (id: string, data: any) => api.put<any>(`/api/expense/${id}`, data),
  delete: (id: string) => api.delete(`/api/expense/${id}`),
};

// Income
export const incomeApi = {
  list: (params?: PaginationParams) => api.get<any>(`/api/income${buildQuery(params)}`),
  create: (data: any) => api.post<any>("/api/income", data),
  update: (id: string, data: any) => api.put<any>(`/api/income/${id}`, data),
  delete: (id: string) => api.delete(`/api/income/${id}`),
};

// Investments
export const investmentApi = {
  list: (params?: PaginationParams) => api.get<any>(`/api/investment${buildQuery(params)}`),
  create: (data: any) => api.post<any>("/api/investment", data),
  update: (id: string, data: any) => api.put<any>(`/api/investment/${id}`, data),
  delete: (id: string) => api.delete(`/api/investment/${id}`),
};

// Payment Methods
export const paymentMethodApi = {
  list: (params?: PaginationParams) => api.get<any>(`/api/paymentmethod${buildQuery(params)}`),
  create: (data: any) => api.post<any>("/api/paymentmethod", data),
  update: (id: string, data: any) => api.put<any>(`/api/paymentmethod/${id}`, data),
  delete: (id: string) => api.delete(`/api/paymentmethod/${id}`),
};

// User
export const userApi = {
  get: (id: string) => api.get<any>(`/api/user/${id}`),
  update: (id: string, data: any) => api.put<any>(`/api/user/${id}`, data),
};
