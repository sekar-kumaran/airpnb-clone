# Enhancement Roadmap — Gap Analysis vs Real Airbnb

Prioritized list of improvements to make this a more complete Airbnb clone.  
Status legend: ✅ Done · ⚠️ Partial · ❌ Missing

---

## 🔴 HIGH PRIORITY (Core UX — Most visible gaps)

### 1. Dynamic Date Picker in Header
- **Problem**: Header's date picker uses hardcoded August/September 2026
- **Fix**: Replace `MONTHS` const in `Header.tsx` with dynamic month generation:
  ```typescript
  const today = new Date()
  const months = [getMonthData(today), getMonthData(addMonths(today, 1))]
  ```
- **File**: `frontend/components/Header.tsx`
- **Effort**: 2 hours

### 2. Real Logged-In State in Header Menu
- **Problem**: Header always shows "Log in or sign up" even when user is logged in
- **Fix**: On client mount, read `localStorage.getItem("userId")` → call `api.me()` → show user name/avatar
- **File**: `frontend/components/Header.tsx`
- **Effort**: 1.5 hours

### 3. Wishlist Heart Button Wired to API
- **Problem**: Heart icon on `ListingCard` and `SearchContent` is purely decorative
- **Fix**: 
  - Add `isWishlisted: boolean` prop + `onToggle` callback
  - Call `api.addToWishlist()` / `api.removeFromWishlist()` on click
  - Load initial wishlist state on mount
- **Files**: `ListingCard.tsx`, `SearchContent.tsx`, `wishlist/page.tsx`
- **Effort**: 3 hours

### 4. Image Carousel on Listing Card Hover
- **Problem**: Cards show only one image; real Airbnb shows 5+ images with dot navigation
- **Fix**: Store multiple image URLs per listing (already in DB via `ListingImage`), return them in `ListingCard` API response, add hover carousel
- **Files**: `backend/routers/listings.py` (`_to_card` function), `ListingCard.tsx`
- **Effort**: 4 hours

### 5. Category Rail (20+ Categories)
- **Problem**: `CategoryRail.tsx` exists but categories are limited and icons are generic
- **Fix**:
  1. Add 20+ categories in `seed.py` with proper names and icon slugs
  2. Use SVG icon map in `CategoryRail.tsx`
  3. Make clicking a category navigate to `/search?category_id=X`
- **Real Airbnb Categories**: Amazing views, Beachfront, Cabins, Camping, Castles, Countryside, Design, Earth homes, Farms, Islands, Lakefront, Luxury, National parks, New, OMG!, Rooms, Skiing, Surfing, Tiny homes, Treehouse, Trending, Tropical, Unique stays
- **Effort**: 3 hours

---

## 🟡 MEDIUM PRIORITY (Notable polish improvements)

### 6. Real Map on Search Page
- **Problem**: Search page shows a fake CSS gradient with randomly positioned price pins
- **Fix**: Integrate `react-map-gl` (Mapbox) or `@react-google-maps/api`
  - Use `listing.lat` and `listing.lng` (already in DB)
  - Show price bubbles at correct coordinates
  - Hover pin → highlight corresponding card
- **Effort**: 6–8 hours (+ API key setup)

### 7. Full Date Range Picker in Booking Card
- **Problem**: `BookingCard.tsx` uses a tiny 63-day mini-grid calendar
- **Fix**: Show two full monthly calendars (like real Airbnb), with proper month navigation
- **Enhancement**: Show unavailable date ranges with diagonal strikethrough styling
- **Effort**: 4 hours

### 8. Guest Selector in Booking Card (Adults/Children/Infants/Pets)
- **Problem**: Booking card uses a plain `<select>` dropdown for guests
- **Fix**: Replace with popover panel matching Header's guest picker (counter buttons per type)
- **Effort**: 2 hours

### 9. Review Breakdown by Category
- **Problem**: Reviews show only overall rating; real Airbnb shows 6 sub-ratings
- **Fix**:
  - Add fields to `Review` model: `cleanliness_rating`, `accuracy_rating`, `communication_rating`, `location_rating`, `checkin_rating`, `value_rating`
  - Update `ReviewList.tsx` to show breakdown bars
- **Effort**: 3 hours backend + 2 hours frontend

### 10. "Show All Photos" Gallery Modal
- **Problem**: `PhotoGallery.tsx` may not have a proper full-screen modal with keyboard nav
- **Fix**: Add backdrop-blurred overlay + left/right arrow navigation + image counter
- **Effort**: 2 hours

### 11. Superhost Badge
- **Problem**: No "Superhost" indicator exists
- **Fix**:
  - Add `is_superhost: bool` to User model
  - Show badge on listing detail host card
  - Add in seed data for top hosts
- **Effort**: 1.5 hours

### 12. Host Dashboard Stats
- **Problem**: Host dashboard only lists bookings/listings, no analytics
- **Fix**: Add `GET /api/host/stats` returning `{ total_revenue, occupancy_rate, avg_rating, total_bookings }`
- **Effort**: 2 hours backend + 2 hours frontend

---

## 🟢 LOW PRIORITY (Nice-to-have polish)

### 13. Animated Search Bar Expansion
- Use CSS `transition: width` or Framer Motion to animate the search bar expanding
- Match Airbnb's spring-based animation tokens

### 14. Price Display Toggle (Per Night vs Total)
- "Prices include all fees" toggle → recalculates displayed price on all cards
- Persist in `localStorage`

### 15. Loading Skeletons
- Add skeleton screens instead of blank loading states
- Use `@/components/Skeleton.tsx` with pulsing gray boxes

### 16. "Things to Know" Section on Listing Detail
- Add `house_rules`, `cancellation_policy`, `safety_info` text fields to Listing model
- Display in expandable section at bottom of detail page

### 17. Named Wishlist Collections
- "Create a new list" button → names like "Goa Trip 2026"
- `POST /api/wishlist/lists { name }` → `WishlistCollection` model

### 18. My Trips — Upcoming vs Past Split
- Add tabs: "Upcoming" and "Past trips"
- Backend: add `?status=upcoming|past` query param to `/api/bookings/mine`
- Show "Add review" CTA on past trips without a review

### 19. Instant Book Toggle
- Add `instant_book: bool` field to Listing
- Show lightning bolt icon on cards that support instant book
- Add filter in FilterModal

### 20. Accessibility
- Ensure all interactive elements have `aria-label`
- Keyboard navigation through date picker
- Screen reader support for image galleries (alt texts)

### 21. Responsive Mobile Pass
- Filters modal as bottom sheet on mobile (instead of center modal)
- Header search as full-screen overlay on mobile
- Listing grid: 1 column on mobile, 2 on tablet

### 22. Footer
- Add Airbnb-style 4-column footer:
  - Support (Help Center, Safety info, Cancellation options)
  - Community (Airbnb.org, Combating discrimination)
  - Hosting (Try hosting, AirCover, Explore hosting resources)
  - Airbnb (Newsroom, Features, Careers, Investors)
  - Bottom bar: © copyright + language selector + currency

---

## 🔧 Backend-Specific Enhancements

| Enhancement | Why | Effort |
|---|---|---|
| Add `GET /api/listings/{id}/reviews` endpoint | Currently reviews are returned only on listing detail; need standalone paginated endpoint | 1h |
| Add price snapshot enforcement in DB | Booking `nightly_rate_snapshot` should be auto-set from listing at creation (currently manual) | 1h |
| Add `is_host` toggle endpoint | `PATCH /api/auth/me { is_host: bool }` so users can become hosts | 1h |
| Add review eligibility check | Block review if booking.check_out > today or review already exists | 1h |
| Add listing `status` toggle | `PATCH /api/listings/{id} { status: "inactive" }` without deleting | 0.5h |
| Add server-side search sorting | `?sort_by=price_asc|price_desc|rating|newest` | 2h |
| Add full-text search | SQLite FTS5 or PostgreSQL `tsvector` on title+description | 4h |
| Replace SQLite with Postgres | For production: connection pooling, concurrent writes | 2h |

---

## Priority Implementation Order

For maximum Airbnb-likeness impact per hour spent:

1. **Dynamic date picker** (#1) — most visibly broken
2. **Logged-in header state** (#2) — immediately breaks trust
3. **Wishlist heart wiring** (#3) — core feature expectation
4. **Category rail with icons** (#5) — first thing user sees on homepage
5. **Image carousel on cards** (#4) — visual WOW factor
6. **Full calendar in booking card** (#7) — booking flow feels incomplete
7. **Review breakdown** (#9) — listing detail feels sparse
8. **Map integration** (#6) — search page is half-empty without it
