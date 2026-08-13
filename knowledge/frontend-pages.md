# Frontend Pages — Next.js App Router

Base: `frontend/app/`  
All pages use App Router (`page.tsx`). Server components unless marked `"use client"`.

---

## `/` — Home / Explore Page

**File**: `app/page.tsx` → renders `<HomePageContent mode={...} />`

**Purpose**: Main discovery page showing curated listing shelves by location/type.

**Data Fetching** (server-side):
```typescript
// page.tsx reads searchParams.mode
// HomePageContent fetches up to 3 shelf groups in parallel
const { results } = await api.searchListings({ location, limit: 8 })
```

**State**: None (pure server component)

**Connected to**:
- `HomePageContent` component → `HomeShelf` → `ListingCard`
- Header (sticky, with expanded search bar)
- Category navigation: `/homes`, `/experiences`, `/services`

**Modes** (via `?mode=` query param):
| Mode | Shelf Titles |
|---|---|
| `all` (default) | Popular homes in North Goa, Lonavala, South Goa |
| `homes` | Varanasi, Noida, New Delhi |
| `experiences` | Airbnb Originals, Varanasi, Popular near you |
| `services` | Gurgaon, Dehradun, Popular near you |

**Enhancement for Airbnb Clone**:
- Add hero banner at top with location suggestions (Airbnb shows a dynamic banner based on user location/past searches)
- Add `CategoryRail` below header with 20+ category icons (Beach, Mountains, Cabins, etc.)
- Add trending destinations section with photo cards
- Add "Airbnb it" CTA at bottom (host sign-up prompt)
- Implement infinite scroll instead of static shelves

---

## `/homes` — Homes Page

**File**: `app/homes/page.tsx`

**Purpose**: Same as Home but with `mode="homes"` — filters shelves to home listings.

**Data Fetching**: Via `HomePageContent` with mode="homes"

**Enhancement**: Add hero search specifically for homes with "Type" filter pre-selected

---

## `/experiences` — Experiences Page

**File**: `app/experiences/page.tsx`

**Purpose**: Shows experience-type listings.

**Enhancement**:
- Airbnb Experiences have a distinct card layout (person-led, activity photo, duration shown)
- Add date/time picker for experiences (single-day event, not multi-night stay)

---

## `/services` — Services Page

**File**: `app/services/page.tsx`

**Purpose**: Shows service-type listings.

**Enhancement**: Likely not on real Airbnb.co.in — Airbnb removed "Services" tab. Replace with "Airbnb Rooms" or keep as custom extension.

---

## `/search` — Search Results

**File**: `app/search/page.tsx`

**Purpose**: Filtered search results + map view.

**Data Fetching** (server-side):
```typescript
// Reads all URLSearchParams → calls api.searchListings()
const { results, total, page, limit } = await api.searchListings({
  location, min_price, max_price, property_type,
  guests, checkin, checkout, category_id, page, limit
})
```

**State** (in `SearchContent` client component):
- `isFilterOpen: boolean` — controls FilterModal visibility

**Layout**: Two-column — listings left, mock map right (sticky)

**URL Params** (all bookmarkable/shareable):
- `location`, `min_price`, `max_price`, `property_type`, `guests`
- `checkin`, `checkout`, `category_id`, `page`

**Connected to**:
- `SearchContent` → `ResultCard`, `FilterModal`
- Pagination links (previous/next page)
- Each card links to `/listing/:id`

**Enhancement for Airbnb Clone**:
- Replace mock map with real Mapbox/Google Maps + clickable pins
- Add infinite scroll (IntersectionObserver) instead of Previous/Next buttons
- Add `Sort by` dropdown (Price: Low to High, Rating, Newest)
- Add date range picker in filters
- "Show map" / "Show list" toggle on mobile
- Add "Save search" feature

---

## `/listing/[id]` — Listing Detail

**File**: `app/listing/[id]/page.tsx`

**Purpose**: Full listing page with gallery, info, and booking card.

**Data Fetching** (server-side):
```typescript
const listing = await api.getListing(id)  // ListingDetail
```

**Layout**: 
- Full-width photo grid hero (1 large + 4 small)
- Two-column: left = details (scrolls), right = BookingCard (sticky)

**Connected to**:
- `PhotoGallery` — image grid + gallery modal
- `BookingCard` — date picker, guest selector, price breakdown, Reserve button
- `ReviewList` — list of reviews with ratings
- `ListingDetail` type: `{ host, title, description, amenities, images, rating, review_count, ... }`

**Enhancement for Airbnb Clone**:
- Add Google Maps embed showing listing location (lat/lng available in model)
- Add "Show all photos" gallery modal with keyboard navigation
- Add "Share" button + "Save" (wishlist toggle) in header bar
- Add host profile section with response rate, response time, join year, reviews
- Add similar listings shelf at bottom
- Add "Things to know" section (house rules, safety info, cancellation policy)
- Add review breakdown by category (Cleanliness, Accuracy, Communication, Location, Value)

---

## `/trips` — My Trips (Guest Bookings)

**File**: `app/trips/page.tsx`

**Purpose**: Shows all bookings made by the current user (guest view).

**Data Fetching** (client-side, requires auth):
```typescript
const bookings = await api.myBookings()
```

**State**: Loading, error, bookings list, cancel confirmation

**Actions**:
- Cancel booking → `api.cancelBooking(id)` → shows toast

**Enhancement for Airbnb Clone**:
- Split into "Upcoming" and "Past" tabs
- Add "Add a review" button on past trips (links to review form)
- Show check-in instructions / directions button
- Add "Trip messages" link (messaging feature)
- Show QR code or booking confirmation number
- Add "Itinerary" download (PDF)

---

## `/wishlist` — Saved Listings

**File**: `app/wishlist/page.tsx`

**Purpose**: Grid of listings saved by the current user.

**Data Fetching** (client-side):
```typescript
const listings = await api.getWishlist()  // ListingCard[]
```

**Actions**:
- Remove from wishlist via heart icon → `api.removeFromWishlist(id)`

**Enhancement for Airbnb Clone**:
- Add **named lists** (e.g., "Goa Trip 2026", "Birthday Getaway")
- Add "Share" list feature
- Show empty state with "Start exploring" CTA
- Add total count badge on nav
- Sync heart icon state across all pages (currently not persisted to wishlist on card)

---

## `/host` — Host Dashboard

**File**: `app/host/page.tsx`

**Purpose**: Host's management view — owned listings + incoming bookings.

**Data Fetching** (client-side, host only):
```typescript
const listings = await api.myListings()       // ListingCard[]
const bookings = await api.hostBookings()     // Booking[]
```

**Sub-routes**:
- `/host/listings/new` — Create new listing form
- `/host/listings/[id]/edit` — Edit existing listing

**Enhancement for Airbnb Clone**:
- Add revenue dashboard (total earned this month, last month, all time)
- Add occupancy calendar heat-map
- Add "Today" view (who's checking in today)
- Add "Switch to traveling" toggle in header
- Add messaging center (host-guest chat)
- Add listing performance analytics (views, booking rate)

---

## `/login` — Login Page (Mocked Auth)

**File**: `app/login/page.tsx`

**Purpose**: Email-only login form. No password.

**Flow**:
1. User enters email
2. `api.login(email)` → returns User
3. `localStorage.setItem("userId", user.id)` 
4. Redirect to `/`

**Enhancement for Airbnb Clone**:
- Add password field + hashing
- Add "Continue with Google" / "Continue with Apple" OAuth buttons
- Add phone number login with OTP
- Show Airbnb-style modal (not full page) for login

---

## `/signup` — Signup Page (Mocked Auth)

**File**: `app/signup/page.tsx`

**Purpose**: Create account with name + email.

**Flow**:
1. User enters name + email
2. `api.signup(name, email)` → returns new User
3. Store userId, redirect to `/`

**Enhancement**: Same as login — add proper auth, terms of service checkbox, avatar upload

---

## Root Layout — `app/layout.tsx`

**Wraps all pages with**:
- `<Header />` — sticky top navigation
- `<ToastProvider />` — global toast context
- Global CSS (`globals.css`)

**Enhancement**:
- Add `<Footer />` with links (Support, Community, Hosting, Airbnb, etc.)
- Add `<CookieConsentBanner />`
- Add loading skeleton between route transitions
