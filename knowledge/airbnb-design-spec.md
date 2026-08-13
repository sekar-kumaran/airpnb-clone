# Airbnb.co.in — Design Specification & UX Analysis

Analyzed from: https://www.airbnb.co.in/

This document captures every observable design pattern, layout, and UX interaction from the real Airbnb website and maps it to what is implemented vs. missing in the clone.

---

## 1. Color System (Airbnb Design Language)

| Token Name | Hex Value | Usage |
|---|---|---|
| Rausch (Primary) | `#FF385C` | CTAs, active states, logo, badges |
| Product Rausch | `#E00B41` | Hover on primary buttons |
| Rausch Gradient | `linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)` | "Airbnb Plus" gradient badge |
| Grey 1000 | `#222222` | Primary text |
| Grey 700 | `#6C6C6C` | Secondary text |
| Grey 400 | `#DDDDDD` | Borders, dividers |
| Grey 100 | `#F7F7F7` | Page/card backgrounds |
| Grey 0 | `#FFFFFF` | White surfaces |
| Spruce (Green) | `#008A05` | Success states, "Available" |
| Arches (Error) | `#C13515` | Error text, validation |
| Shadow 150 | `rgba(0,0,0,0.12)` | Card shadows |
| Shadow 350 | `rgba(0,0,0,0.28)` | Modal/drawer shadows |

---

## 2. Typography

| Scale | Font Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| Display XL | 72px / 4.5rem | 74px | 600 | Hero headlines |
| Display L | 60px / 3.75rem | 68px | 600 | Section headers |
| Display M | 40px / 2.5rem | 44px | 600 | Page titles |
| Title XL | 32px / 2rem | 36px | 600 | Card section titles |
| Title L | 26px / 1.625rem | 30px | 600 | Listing title |
| Title M | 22px / 1.375rem | 26px | 600 | Subtitles |
| Title S | 18px / 1.125rem | 24px | 600 | Body headings |
| Body M | 16px / 1rem | 20px | 400 | Main body text |
| Body S | 14px / 0.875rem | 18px | 400 | Supporting text |
| Caption | 12px / 0.75rem | 16px | 400 | Labels, timestamps |

**Font Family**: `'Airbnb Cereal VF', 'Circular', -apple-system, 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', sans-serif`

**Clone Improvement**: Replace browser default font with `Inter` from Google Fonts as closest free alternative to Airbnb Cereal.

---

## 3. Spacing & Border Radius System

| Token | Value | Usage |
|---|---|---|
| Micro 4px | `4px` | Tight gaps |
| Micro 8px | `8px` | Icon spacing |
| Micro 12px | `12px` | Button padding |
| Micro 16px | `16px` | Card padding |
| Macro 24px | `24px` | Section gaps |
| Macro 32px | `32px` | Component separation |
| Macro 48px | `48px` | Page section spacing |

| Border Radius | Value | Usage |
|---|---|---|
| Tiny | 4px | Tags, pills |
| Small | 8px | Buttons |
| Medium | 12px | Cards |
| Large | 16px | Images |
| XLarge | 20px | Filter chips |
| XXLarge | 24px | Modals |
| XXXLarge | 32px | Search bar, large cards |
| Full | 100px / 50% | Pill buttons, avatars |

---

## 4. Header (Observed on Airbnb.co.in)

### Desktop Layout
```
[Logo]     [Where | Check-in | Checkout | Who]    [Become a host] [Language 🌐] [☰ Profile]
                         ↓ (below header)
[All] [Homes] [Experiences] [Services]   ← Tab navigation (same line as category icons on home)
```

### Behavior
- Scrolls with page on home, becomes sticky only after user scrolls past hero
- On search/listing pages: collapses to compact pill form
- Search bar expands on click: location → date → guests, panel slides in
- Location suggests: shows thumbnailed suggested destinations
- Date picker: two-month side-by-side calendar, "Exact dates" / "+1 day" etc. chips
- Guest picker: Adults (13+) / Children (2–12) / Infants / Pets

### Current Clone vs Real Airbnb
| Feature | Clone | Real Airbnb |
|---|---|---|
| Logo | ✅ Text "airbnb" with circle | ✅ SVG logo (red) |
| Search bar | ✅ Three-segment pill | ✅ |
| Location suggestions | ✅ Hardcoded list | ❌ Real Airbnb uses geolocation + personalization |
| Date picker | ⚠️ Static (hardcoded months) | ✅ Dynamic real dates |
| Guest picker | ✅ | ✅ |
| Nav tabs | ✅ All/Homes/Experiences/Services | ✅ |
| User menu | ⚠️ Always shows login/signup | ✅ Shows avatar when logged in |
| Language selector | ⚠️ Button exists, no functionality | ✅ Currency/language modal |

---

## 5. Homepage Layout (Airbnb.co.in)

### Section Order
1. **Hero Header** (with search bar already integrated)
2. **Category Rail**: horizontal scroll with 20+ category icons + labels
3. **Listing Grid**: 4-5 columns on desktop, 2 on tablet, 1 on mobile
4. **"Airbnb your home" CTA section** (shown in middle of grid scroll)
5. **Footer**: links grid (Support / Hosting / Airbnb / Terms)

### Category Rail (20+ Categories Observed)
- Amazing views, Beachfront, Cabins, Camping, Castles, Countryside, Design, Earth homes, Farms, Islands, Lakefront, Luxury, National parks, New, OMG!, Rooms, Skiing, Surfing, Tiny homes, Treehouse, Trending, Tropical, Unique stays

### Listing Card (Standard)
```
┌─────────────────────────┐
│  Image (16:9, rounded)  │ ← heart icon top-right, "Guest favourite" badge top-left
│  ● ● ● ● ●             │ ← dots for image carousel
├─────────────────────────┤
│ Title (1 line truncated)│
│ Location / Category     │
│ Available dates         │
│ ₹X,XXX night     ★4.9 │ ← price left, rating right
└─────────────────────────┘
```

---

## 6. Search Results Page (Airbnb.co.in)

### Layout
- Left panel (60%): Listing cards in 2-column grid
- Right panel (40%): Interactive map (sticky)
- Top bar: Filters pill row (Filter, Price, Type of place, Rooms & beds, More filters)
- Header is compact pill

### Featured Card (First result)
- Full-width horizontal card with larger image
- Shows "Guest favourite" badge, image carousel, dates shown, "X for 2 nights" price

### Filters Modal
- Price range slider (histogram showing distribution)
- Type of place: Entire home / Private room / Shared room
- Rooms and beds counters
- Amenities checklist with icons
- Property type grid (House, Apartment, Guesthouse, Hotel)
- Accessibility features
- Host language
- Booking options (Instant Book, Self check-in, Allows pets, etc.)
- Top-tier stays (Guest favourites, plus, luxe)

---

## 7. Listing Detail Page (Airbnb.co.in)

### Photo Grid
```
┌───────────────┬───────┬───────┐
│               │  img  │  img  │
│  Main photo   ├───────┼───────┤
│               │  img  │  img  │
└───────────────┴───────┴───────┘
                      [Show all photos →]
```
- 5 images max visible; button opens full gallery modal
- Gallery modal: full-screen dark overlay, keyboard nav, image counter

### Two-Column Layout
**Left Column (scrollable)**:
1. Title (26px bold)
2. Location + guests/beds/baths/reviews summary
3. Host card (avatar, name, "Superhost" badge, join date)
4. Highlights (3 icon+text features: free parking, wifi, etc.)
5. "Guest favourite" badge if applicable
6. Full description (truncated with "Show more")
7. Sleeping arrangements (bedroom cards)
8. Amenities grid (first 10 shown, "Show all X amenities" modal)
9. Availability calendar (full 12-month view)
10. Review breakdown (categories + all reviews)
11. Map with neighborhood label
12. Host profile section
13. "Things to know" (house rules, safety, cancellation policy)

**Right Column (sticky)**:
- Booking card (price/night, rating, date picker, guest selector, Reserve CTA)
- Price breakdown appears after dates selected
- "You won't be charged yet" text
- "Report this listing" link at bottom

---

## 8. Booking Card (Airbnb.co.in)

```
┌─────────────────────────────────┐
│ ₹X,XXX /night          ★4.92  │
├────────────────┬────────────────┤
│    CHECK-IN    │    CHECKOUT    │
│    Aug 11      │    Aug 16      │
├────────────────┴────────────────┤
│  GUESTS                         │
│  2 guests                    ▼  │
└─────────────────────────────────┘
       [Reserve]
  You won't be charged yet

₹X,XXX × 5 nights        ₹XX,XXX
Cleaning fee               ₹X,XXX
Service fee                ₹X,XXX
────────────────────────────────
Total before taxes         ₹XX,XXX
```

---

## 9. Motion & Animation Tokens (From Airbnb CSS)

| Token | Duration | Easing | Usage |
|---|---|---|---|
| Standard | 583ms | `linear(...)` (spring) | Most transitions |
| Fast | 451ms | `linear(...)` (spring) | Quick interactions |
| Fast Bounce | 449ms | spring with bounce | Modal pop-ins |
| Medium Bounce | 574ms | spring with bounce | Panel slides |
| Enter curve | `cubic-bezier(0.1, 0.9, 0.2, 1)` | Element enters |
| Exit curve | `cubic-bezier(0.4, 0, 1, 1)` | Element exits |
| Standard curve | `cubic-bezier(0.2, 0, 0, 1)` | General |

**Clone Enhancement**: Use `framer-motion` for spring animations matching Airbnb's motion tokens.

---

## 10. Key Missing UI Patterns

| Pattern | Priority | Implementation Note |
|---|---|---|
| Image carousel on card hover | High | Add multiple images to ListingCard, auto-advance |
| Category rail with 20+ icons | High | Add SVG icons per category in DB |
| Dynamic date picker | High | Replace hardcoded months with real Date logic |
| Real map integration | High | Mapbox GL JS or Google Maps API |
| "Show all photos" gallery modal | Medium | Already partially done |
| Review breakdown by category | Medium | Add 6 sub-ratings to Review model |
| Logged-in avatar in header | Medium | Read user from localStorage on mount |
| "Guest favourite" badge | Low | Already present in clone |
| Animated search bar expand | Low | CSS transition on width |
| Infinite scroll | Low | IntersectionObserver + cursor-based pagination |
| Price toggle (per night vs total) | Low | Context state + localStorage |
| Superhost badge | Low | Add `is_superhost` field to User |
| "Things to know" section | Low | Add `house_rules`, `cancellation_policy` fields to Listing |
