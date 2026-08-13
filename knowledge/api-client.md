# API Client Reference

File: `frontend/lib/api-client.ts`

The `api` object is a typed fetch wrapper that:
1. Reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
2. Attaches `X-User-Id` header from `localStorage` on every request
3. Throws an `Error` with `body.detail` on non-2xx responses
4. Returns `undefined` on 204 No Content

---

## Auth Methods

| Method | HTTP | Path | Payload | Returns |
|---|---|---|---|---|
| `api.login(email)` | POST | `/api/auth/login` | `{ email }` | `User` |
| `api.signup(name, email)` | POST | `/api/auth/signup` | `{ name, email }` | `User` |
| `api.me()` | GET | `/api/auth/me` | — | `User` |

---

## Listing Methods

| Method | HTTP | Path | Payload/Params | Returns |
|---|---|---|---|---|
| `api.searchListings(filters)` | GET | `/api/listings` | SearchFilters object | `{ results, total, page, limit }` |
| `api.getListing(id)` | GET | `/api/listings/:id` | — | `ListingDetail` |
| `api.getAvailability(id)` | GET | `/api/listings/:id/availability` | — | `{ booked_ranges }` |
| `api.myListings()` | GET | `/api/listings/mine` | — | `ListingCard[]` |
| `api.createListing(payload)` | POST | `/api/listings` | listing data | `ListingDetail` |
| `api.updateListing(id, payload)` | PATCH | `/api/listings/:id` | partial listing data | `ListingDetail` |
| `api.deleteListing(id)` | DELETE | `/api/listings/:id` | — | `void` |

### SearchFilters type
```typescript
interface SearchFilters {
  location?: string
  min_price?: number
  max_price?: number
  property_type?: string
  amenity_ids?: number[]
  category_id?: number
  guests?: number
  checkin?: string     // "YYYY-MM-DD"
  checkout?: string    // "YYYY-MM-DD"
  page?: number
  limit?: number
}
```

---

## Booking Methods

| Method | HTTP | Path | Payload | Returns |
|---|---|---|---|---|
| `api.createBooking(payload)` | POST | `/api/bookings` | `{ listing_id, check_in, check_out, guests_count }` | `Booking` |
| `api.myBookings()` | GET | `/api/bookings/mine` | — | `Booking[]` |
| `api.cancelBooking(id)` | DELETE | `/api/bookings/:id` | — | `Booking` |
| `api.hostBookings()` | GET | `/api/host/bookings` | — | `Booking[]` |

---

## Wishlist Methods

| Method | HTTP | Path | Returns |
|---|---|---|---|
| `api.getWishlist()` | GET | `/api/wishlist` | `ListingCard[]` |
| `api.addToWishlist(listingId)` | POST | `/api/wishlist/:id` | `void` |
| `api.removeFromWishlist(listingId)` | DELETE | `/api/wishlist/:id` | `void` |

---

## Meta Methods

| Method | HTTP | Path | Returns |
|---|---|---|---|
| `api.getAmenities()` | GET | `/api/amenities` | `{ id, name, icon }[]` |
| `api.getCategories()` | GET | `/api/categories` | `{ id, name, icon }[]` |

---

## Internal Helpers

```typescript
function getCurrentUserId(): string | null
// Returns localStorage.getItem("userId") — null on server-side

async function request<T>(path: string, options?: RequestInit): Promise<T>
// Adds Content-Type + X-User-Id headers
// Throws Error on !res.ok
// Returns undefined on 204
```

---

## Usage Pattern

```typescript
// In server component (page.tsx)
import { api } from "@/lib/api-client"
const listings = await api.searchListings({ location: "Goa", limit: 8 })

// In client component
import { api } from "@/lib/api-client"
const { showToast } = useToast()

async function handleReserve() {
  try {
    await api.createBooking({ listing_id, check_in, check_out, guests_count })
    showToast("Booking confirmed!", "success")
  } catch (err: any) {
    showToast(err.message, "error")
  }
}
```

---

## Enhancement Opportunities

- Add **request caching**: `cache: "force-cache"` with `revalidate` for static data like amenities/categories
- Add **retry logic** for transient network failures
- Add **request deduplication** (SWR or React Query) for client-side fetching
- Add **optimistic updates** for wishlist toggle (instant UI, rollback on error)
- Replace with auto-generated client from OpenAPI spec (`openapi-typescript-codegen`)
