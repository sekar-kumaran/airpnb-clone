# Frontend Components

Base: `frontend/components/`

---

## Header (`Header.tsx`)

**Type**: Client Component (`"use client"`)

**Purpose**: Sticky top navigation bar with logo, nav tabs, search bar/pill, and user menu.

**Internal State**:
| State | Type | Purpose |
|---|---|---|
| `menuOpen` | boolean | Shows/hides user dropdown menu |
| `searchOpen` | boolean | Shows/hides search panel |
| `activeField` | `"where"\|"when"\|"who"` | Which search panel is open |
| `location` | string | Currently typed/selected location |
| `adults/children/infants/pets` | number | Guest counts |

**Behavior**:
- Detects current path → collapses to compact pill when on `/search` or `/listing/:id`
- `submitSearch()` → builds URLSearchParams from state → navigates to `/search?...`
- `chooseDestination(city)` → sets location + advances to "when" tab
- Click outside refs → closes open panels

**Connected Pages**: All (rendered in root layout)

**Sub-components**:
- `Logo` — internal, renders the "A airbnb" logo link
- Search dropdowns: location suggestions, date picker calendar, guest counter

**Airbnb Enhancements**:
- Dates calendar currently **static** (hardcoded Aug/Sep 2026) — needs real `Date` logic
- Add "Flexible dates" tab in date picker
- Add "I'm flexible" for location (shows random worldwide destinations)
- Add "Experiences" vs "Homes" search mode toggle in search bar
- Animate search bar expansion like real Airbnb (smooth width transition)
- Add user avatar in menu when logged in (currently always shows login/signup)
- Add notification bell icon
- Header background becomes transparent on home page scroll-up (glass effect)

---

## HomePageContent (`HomePageContent.tsx`)

**Type**: Server Component (async)

**Purpose**: Renders 3 shelf sections based on active mode (`all|homes|experiences|services`).

**Props**:
```typescript
{ mode?: "all" | "homes" | "experiences" | "services" }
```

**Data Fetching**:
- Calls `api.searchListings()` for each shelf (parallel with `Promise.all`)
- Falls back to generic listing results if a shelf returns no results

**Output**: 
- Maps `MODE_SECTIONS[mode]` → renders `<HomeShelf>` for each section
- Renders `<HomeFeePill>` at bottom

**Connected Pages**: `/`, `/homes`, `/experiences`, `/services`

**Airbnb Enhancements**:
- Add `CategoryRail` between header and shelves
- Add hero banner (dynamic image based on season/location)
- Add "Airbnb your home" promo section mid-page
- Add recently viewed listings shelf (requires user tracking)

---

## HomeShelf (`HomeShelf.tsx`)

**Type**: Client Component

**Purpose**: Horizontally scrollable row of listing cards with a title and "Show all" link.

**Props**:
```typescript
{
  title: string
  subtitle?: string
  listings: ListingCard[]
  href: string       // "Show all" link target
}
```

**Connected to**: `ListingCard`, home/mode pages

**Airbnb Enhancements**:
- Add left/right arrow navigation buttons (appears on hover)
- Add dot indicators for scroll position
- On mobile: snap-scroll behavior

---

## ListingCard (`ListingCard.tsx`)

**Type**: Client Component

**Purpose**: Photo-forward card shown in grids and shelves.

**Props**:
```typescript
{
  listing: ListingCard   // { id, title, city, country, price_per_night, cover_image, rating, review_count }
}
```

**Behavior**:
- Clicking navigates to `/listing/:id`
- Heart icon → wishlist toggle (currently UI-only, not wired to API)
- Image hover → slight zoom scale

**Airbnb Enhancements**:
- Heart icon should call `api.addToWishlist()` / `api.removeFromWishlist()` and sync state
- Add image carousel on hover (multiple dots, auto-advance)
- Add "Guest favourite" badge when `rating >= 4.9`
- Add loading skeleton while image loads
- Show "Rare find" badge for high-demand listings
- Show dates below price when dates are selected in search
- Currency formatting based on locale (₹ for India)

---

## ListingGrid (`ListingGrid.tsx`)

**Type**: Server or Client Component

**Purpose**: Responsive CSS grid container for ListingCards.

**Props**:
```typescript
{ listings: ListingCard[] }
```

**Current Grid**: Fixed columns via Tailwind
**Enhancement**: Implement infinite scroll via `IntersectionObserver` + `api.searchListings({ page: nextPage })`

---

## SearchContent (`SearchContent.tsx`)

**Type**: Client Component

**Purpose**: Renders search results list + mock map panel.

**Props**:
```typescript
{
  listings: ListingCard[]
  total: number
  page: number
  limit: number
  searchParams: { location?, min_price?, max_price?, property_type?, guests?, checkin?, checkout?, category_id?, page? }
  categories: Category[]
}
```

**Internal State**:
- `isFilterOpen: boolean` — FilterModal visibility

**Layout**:
- Left: filter bar pills + featured card + grid
- Right: sticky mock map panel (fake price pins positioned randomly)

**Internal `ResultCard`**: Shows listing as either featured (large horizontal) or standard (square)

**Pagination**: Previous / "Show more" links

**Airbnb Enhancements**:
- Replace mock map with real Mapbox integration
- Wire "Price" and "Type of place" pill buttons to filter state
- Add `Sort by` dropdown
- Show map pins at actual lat/lng coordinates
- Add "Show on map" button on each card
- Animate pin highlight when card is hovered

---

## BookingCard (`BookingCard.tsx`)

**Type**: Client Component (`"use client"`)

**Purpose**: Sticky booking widget on listing detail page. Handles date selection, guests, price breakdown, and reservation flow.

**Props**:
```typescript
{ listing: ListingDetail }
```

**Internal State**:
| State | Type | Purpose |
|---|---|---|
| `checkIn` | string | Selected check-in date (ISO) |
| `checkOut` | string | Selected check-out date (ISO) |
| `guestsCount` | number | Number of guests |
| `bookedRanges` | BookedRange[] | Fetched from API on mount |
| `loading` | boolean | Reserve button loading state |
| `confirmOpen` | boolean | Shows confirmation modal |

**Data Fetching**:
```typescript
// On mount: loads existing bookings to block dates
await api.getAvailability(listing.id)
```

**Price Calculation**:
```typescript
nights = (checkOut - checkIn) in days
basePrice = nights × price_per_night
cleaningFee = listing.cleaning_fee
serviceFee = round(basePrice × service_fee_pct)
total = basePrice + cleaningFee + serviceFee
```

**Flow**:
1. User picks dates on calendar → unavailable dates are crossed out
2. User selects guests count from dropdown
3. Clicks "Reserve" → `validateSelection()` → opens confirm modal
4. Confirm → `api.createBooking()` → toast → redirect to `/trips`

**Connected Pages**: `/listing/[id]`

**Airbnb Enhancements**:
- Replace inline calendar with full date range picker modal (like real Airbnb)
- Add guest breakdown (Adults / Children / Infants / Pets counters like Header)
- Show "You won't be charged yet" only before clicking Reserve
- Add pet fee line item
- Add "This is a rare find" banner if listing is popular
- Add "Contact host" button below Reserve
- Monthly calendar view (currently shows 63 days in a mini grid)
- Add "Flexible dates" option

---

## BookingCardWrapper (`BookingCardWrapper.tsx`)

**Type**: Client Component

**Purpose**: Thin wrapper that lazy-loads BookingCard (allows parent server component to pass listing data).

**Props**: `{ listing: ListingDetail }`

---

## PhotoGallery (`PhotoGallery.tsx`)

**Type**: Client Component

**Purpose**: Shows listing images in a 1-large + 4-small grid layout. Clicking opens full gallery modal.

**Props**:
```typescript
{ images: { id: number; url: string; sort_order: number }[] }
```

**Internal State**:
- `modalOpen: boolean` — gallery lightbox open/closed
- `activeIndex: number` — which image is shown in modal

**Airbnb Enhancements**:
- Add "Show all photos" button (currently might be missing)
- Support keyboard navigation (left/right arrows) in modal
- Add image count indicator (`3 / 12`)
- Add zoom on pinch gesture (mobile)
- Lazy-load images with blur placeholder
- Add video support (real Airbnb allows video in gallery)

---

## FilterModal (`FilterModal.tsx`)

**Type**: Client Component

**Purpose**: Full modal overlay with advanced filters for search results.

**Props**:
```typescript
{ isOpen: boolean; onClose: () => void }
```

**Current Filters**:
- Price range slider
- Property type selection
- Amenities checklist (loads from `api.getAmenities()`)
- Bedrooms/beds/bathrooms counter

**How filters are applied**: Modal submits by navigating to `/search?min_price=...&max_price=...&...`

**Airbnb Enhancements**:
- Add "Type of place" section (Entire place / Private room / Shared room)
- Add accessibility features filter
- Add "Standout stays" filter (Treehouse, Boat, Cave, etc.)
- Add instant book toggle
- Add host language filter
- Add results count that updates as filters change (without closing modal)

---

## CategoryRail (`CategoryRail.tsx`)

**Type**: Client Component

**Purpose**: Horizontally scrollable row of category icons below the header for quick filtering.

**Props**: Fetches categories from `api.getCategories()` or receives as prop

**Behavior**: Clicking a category navigates to `/search?category_id=X`

**Airbnb Enhancements**:
- Real Airbnb has 20+ categories: Amazing views, Cabins, Beach, Countryside, Design, Tiny homes, etc.
- Each category has a unique SVG icon
- Active category is underlined
- Add "Filters" button at right edge of rail
- Add "Price" toggle pill to show prices with/without fees

---

## ReviewList (`ReviewList.tsx`)

**Type**: Client or Server Component

**Purpose**: Renders list of reviews for a listing.

**Props**:
```typescript
{ reviews: Review[] }
// Review: { id, guest: User, rating, comment, created_at }
```

**Airbnb Enhancements**:
- Add average rating breakdown by category (Cleanliness, Accuracy, Communication, Location, Check-in, Value)
- Add "Read more" expand for long comments
- Add reviewer avatar image
- Paginate reviews (Show all → open full review modal)
- Add "Translate" button for non-English reviews

---

## ToastProvider (`ToastProvider.tsx`)

**Type**: Client Component (Context Provider)

**Purpose**: Global toast/notification system. Wraps app in `layout.tsx`.

**Exported Hook**:
```typescript
const { showToast } = useToast()
showToast("Message text", "success" | "error" | "info")
```

**Airbnb Enhancements**:
- Add undo action on toasts (e.g., "Removed from wishlist" + Undo button)
- Add wishlist-specific toast with thumbnail
- Auto-dismiss after 4 seconds (may already be implemented)

---

## HomeFeePill (`HomeFeePill.tsx`)

**Type**: Client Component

**Purpose**: Small floating pill/badge showing "Prices include all fees" toggle info.

**Airbnb Enhancements**:
- Should toggle between "per night" and "total price" display mode
- Persist preference in `localStorage`
- Update all ListingCard prices when toggled

---

## ConfirmDialog (`ConfirmDialog.tsx`)

**Type**: Client Component

**Purpose**: Reusable confirmation modal (used for cancel booking, delete listing, etc.)

**Props**:
```typescript
{
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}
```
