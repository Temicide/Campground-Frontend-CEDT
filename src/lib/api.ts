const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = { "Content-Type": "application/json", ...options.headers };
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Auth
export const register = (body: object) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const login = (body: object) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const logout = () => apiFetch("/auth/logout");

export const getMe = () => apiFetch("/protected");

// Campgrounds
export const getCampgrounds = () => apiFetch("/campgrounds");

// Bookings
export const createBooking = (body: object) =>
  apiFetch("/bookings", { method: "POST", body: JSON.stringify(body) });

export const getMyBookings = () => apiFetch("/bookings/me");

export const getAllBookings = () => apiFetch("/bookings");

export const updateBooking = (id: string, body: object) =>
  apiFetch(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteBooking = (id: string) =>
  apiFetch(`/bookings/${id}`, { method: "DELETE" });
