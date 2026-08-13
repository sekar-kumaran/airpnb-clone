/**
 * Thin fetch wrapper for the FastAPI backend.
 *
 * Auth is mocked (see backend/app/routers/deps.py): once a user "logs in" we
 * store their id and attach it as X-User-Id on every request. This is
 * intentionally simple — swap for real cookies/JWT only if there's time left
 * after core features (per the master prompt's phase plan).
 */
import type { ListingCard, ListingDetail, Booking, User, SearchFilters } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userId = getCurrentUserId();
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Listings
  searchListings: (filters: SearchFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });
    return request<{ results: ListingCard[]; total: number; page: number; limit: number }>(
      `/api/listings?${params.toString()}`
    );
  },
  getListing: (id: number) => request<ListingDetail>(`/api/listings/${id}`),
  getAvailability: (id: number) =>
    request<{ booked_ranges: { check_in: string; check_out: string }[] }>(
      `/api/listings/${id}/availability`
    ),

  // Host Listings
  createListing: (payload: any) =>
    request<ListingDetail>("/api/listings", { method: "POST", body: JSON.stringify(payload) }),
  updateListing: (id: number, payload: any) =>
    request<ListingDetail>(`/api/listings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteListing: (id: number) =>
    request(`/api/listings/${id}`, { method: "DELETE" }),
  myListings: () => request<ListingCard[]>("/api/listings/mine"),

  // Bookings
  createBooking: (payload: { listing_id: number; check_in: string; check_out: string; guests_count: number }) =>
    request<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(payload) }),
  myBookings: () => request<Booking[]>("/api/bookings/mine"),
  cancelBooking: (id: number) => request<Booking>(`/api/bookings/${id}`, { method: "DELETE" }),
  hostBookings: () => request<Booking[]>("/api/host/bookings"),

  // Wishlist
  getWishlist: () => request<ListingCard[]>("/api/wishlist"),
  addToWishlist: (listingId: number) => request(`/api/wishlist/${listingId}`, { method: "POST" }),
  removeFromWishlist: (listingId: number) => request(`/api/wishlist/${listingId}`, { method: "DELETE" }),

  // Auth (mocked)
  login: (email: string) => request<User>("/api/auth/login", { method: "POST", body: JSON.stringify({ email }) }),
  signup: (name: string, email: string) =>
    request<User>("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email }) }),
  me: () => request<User>("/api/auth/me"),

  // Meta
  getAmenities: () => request<{ id: number; name: string; icon: string | null }[]>("/api/amenities"),
  getCategories: () => request<{ id: number; name: string; icon: string | null }[]>("/api/categories"),
};
