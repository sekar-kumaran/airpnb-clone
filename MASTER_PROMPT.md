# Airbnb Clone — Master Build Prompt & Blueprint

This document has two parts:
1. **The Blueprint** — my analysis of how Airbnb actually works, translated into an architecture, schema, and API design for this assignment.
2. **The Master Prompt** — a copy-paste-ready prompt (written to an AI coding agent) that uses the blueprint to build the whole thing in phases. Feed it to Claude Code / Cursor / Copilot Workspace one phase at a time for best results — trying to do all 24 hours of work in one shot tends to produce shallow, inconsistent code.

---

## PART 1 — Blueprint

### 1.1 What actually makes something "feel like Airbnb"

Airbnb's product has a few load-bearing UX patterns that a generic CRUD listings app misses. Get these right and 80% of the "visual/functional similarity" grading criterion is covered:

- **Photo-forward cards**: large rounded-corner image (with a subtle hover scale/carousel dot indicator), heart/wishlist icon top-right, price per night in bold, small gray rating with a star icon, title truncated to 1 line, location/subtitle truncated to 1 line.
- **Sticky, pill-shaped search bar** in the header that collapses to "Where / Check in / Check out / Who" segments, expanding into a dropdown/modal on click.
- **Horizontally scrollable category rail** (icons + label: Amazing views, Cabins, Trending, etc.) directly below the header — this is the primary "filter" affordance, backed by a secondary Filters button that opens a modal (price range slider, property type, amenities checklist, rooms/beds).
- **Grid layout**: responsive 1 → 2 → 3 → 4 → 5 columns, infinite scroll (or "Show more" pagination) rather than numbered pages.
- **Listing detail page**: a hero **photo grid** (1 big + 4 small, click → full gallery modal), then a two-column layout — left column scrolls (title, host, description, amenities, calendar, reviews), right column has a **sticky booking card** (price, date pickers, guest selector, Reserve button, price breakdown that only appears after dates are picked).
- **Date range picker** that visually disables/greys out unavailable dates and won't let you select a range that includes a booked date.
- **Reserve → Confirm modal/page** flow (not a single button that immediately books) with a price breakdown: nightly rate × nights, cleaning fee, service fee, total.
- **Toasts/snackbars** for wishlist add, booking confirmation, listing saved, errors — Airbnb never uses blocking `alert()`.
- **Host mode toggle** ("Switch to hosting") rather than a separate app — same nav, different left-side content (dashboard, listings, reservations).

### 1.2 Core entities & relationships

```
User            (id, name, email, avatar_url, is_host, created_at)
Listing         (id, host_id → User, title, description, property_type,
                 price_per_night, cleaning_fee, service_fee_pct,
                 city, country, lat, lng, max_guests, bedrooms, beds, bathrooms,
                 status[active|inactive], created_at, updated_at)
ListingImage    (id, listing_id → Listing, url, sort_order)
Amenity         (id, name, icon)
ListingAmenity  (listing_id, amenity_id)                [join table]
Category        (id, name, icon)                        [Amazing views, Cabins...]
ListingCategory (listing_id, category_id)                [join table]
Booking         (id, listing_id → Listing, guest_id → User,
                 check_in, check_out, guests_count,
                 nightly_rate_snapshot, cleaning_fee_snapshot, service_fee_snapshot,
                 total_price, status[confirmed|cancelled], created_at)
Review          (id, booking_id → Booking, listing_id → Listing, guest_id → User,
                 rating (1-5), comment, created_at)
Wishlist        (id, user_id → User, listing_id → Listing, created_at)
```

Notes:
- Snapshot the price fields on `Booking` at time of booking — a host editing price later must not retroactively change a guest's past trip cost. This is a detail interviewers specifically probe for ("what happens if the host changes the price after I book?").
- `Review` links to `Booking`, not just `Listing` + `User`, so you can enforce "only after a completed stay" (bonus feature) and prevent duplicate reviews per stay.
- Availability is **derived**, not stored: a date range is available iff no `Booking` with `status=confirmed` overlaps it. Don't build a separate `Availability` calendar table for MVP — it's redundant state that can drift out of sync. (Mention this reasoning in the README — it reads as deliberate schema design, not an oversight.)

### 1.3 API design (REST, FastAPI)

```
Auth (mocked)
  POST   /api/auth/login          { email }            → user + fake session token
  POST   /api/auth/signup         { name, email }
  GET    /api/auth/me

Listings
  GET    /api/listings            ?location&checkin&checkout&guests&min_price&max_price
                                   &property_type&amenities[]&category&page&limit
  GET    /api/listings/{id}
  POST   /api/listings                       (host only)
  PATCH  /api/listings/{id}                  (host, owner only)
  DELETE /api/listings/{id}                  (host, owner only)
  GET    /api/listings/{id}/availability     ?month=YYYY-MM  → booked date ranges
  GET    /api/listings/{id}/reviews

Bookings
  POST   /api/bookings              { listing_id, check_in, check_out, guests }
  GET    /api/bookings/mine                     (guest's "My Trips")
  DELETE /api/bookings/{id}                     (cancel)
  GET    /api/host/bookings                     (host dashboard: bookings across owned listings)

Wishlist
  GET    /api/wishlist
  POST   /api/wishlist/{listing_id}
  DELETE /api/wishlist/{listing_id}

Reviews
  POST   /api/reviews             { booking_id, rating, comment }

Meta
  GET    /api/amenities
  GET    /api/categories
```

Server-side validation that must exist (this is what "Functionality" grading actually checks):
- Reject a booking if `check_in >= check_out`, if the range overlaps any existing confirmed booking for that listing, or if `guests_count > listing.max_guests`.
- Use a DB-level transaction + re-check overlap at insert time (not just in the request handler) to avoid a race condition between two simultaneous bookings — worth doing even for a SQLite assignment, and a great thing to explain in the interview.

### 1.4 Frontend page/route map (Next.js App Router)

```
/                          Explore/home grid
/listing/[id]              Listing detail + booking card
/search                    Search results (query params drive filters)
/trips                     "My Trips" (guest bookings)
/wishlist                  Saved listings
/host                      Host dashboard (owned listings + booking stats)
/host/listings/new         Create listing form
/host/listings/[id]/edit   Edit listing form
/login                     Mocked auth (choose/create user)
```

Component inventory worth pre-planning (drives "modularity" grading):
`Header`, `SearchBar` (+ `SearchModal`), `CategoryRail`, `FiltersModal`, `ListingCard`, `ListingGrid`, `PhotoGallery` (+ `GalleryModal`), `DateRangePicker`, `GuestSelector`, `BookingCard`, `PriceBreakdown`, `ReviewList`, `ReviewCard`, `Toast/ToastProvider`, `HostListingForm`, `HostBookingsTable`, `WishlistButton`, `Pagination/InfiniteScrollTrigger`.

### 1.5 DevOps layer (this is graded implicitly via "backend/api design" and explicitly if you want the bonus polish)

- **Containerization**: `docker-compose.yml` with two services — `frontend` (Next.js) and `backend` (FastAPI + SQLite volume) — so the whole thing runs with `docker compose up` for the evaluator.
- **CI**: GitHub Actions workflow that on every push runs: backend `ruff`/`flake8` lint + `pytest`, frontend `eslint` + `tsc --noEmit` + build. Cheap to add, and "code quality" graders check for CI existence.
- **Env management**: `.env.example` in both `frontend/` and `backend/`, never commit real `.env`.
- **Pre-commit** (optional but cheap): `pre-commit` hook running `ruff format` + `prettier`.
- **Deployment**: frontend → Vercel (native Next.js support, zero config). Backend → Railway or Render (both support a `Dockerfile` + persistent volume for SQLite; Render's free tier disk is ephemeral on redeploy, so note that in the README, or switch SQLite file to a mounted disk).
- **Makefile** for one-liners: `make dev`, `make seed`, `make test`, `make lint`.

### 1.6 Suggested repo layout

```
airbnb-clone/
├── frontend/                 (Next.js + TS)
│   ├── app/
│   ├── components/
│   ├── lib/api-client.ts
│   ├── types/
│   └── .env.example
├── backend/                  (FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── crud/
│   │   ├── db.py
│   │   └── seed.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml
├── .github/workflows/ci.yml
├── Makefile
└── README.md
```

### 1.7 24-hour time budget (realistic, for pacing yourself against the estimate)

| Phase | Hours |
|---|---|
| Scaffolding, DB schema, seed script | 2–3 |
| Backend API (listings, filters, availability) | 3–4 |
| Booking flow + validation/transactions | 2–3 |
| Frontend: home/search/grid/filters | 3–4 |
| Frontend: listing detail + gallery + calendar | 3 |
| Frontend: booking flow + My Trips | 2 |
| Host CRUD + dashboard | 3 |
| Wishlist, toasts, polish, responsive | 2 |
| DevOps (Docker, CI, deploy) + README | 1–2 |

---

## PART 2 — The Master Prompt

Copy everything below the line into your AI coding tool. It's written as a standing brief the agent should treat as ground truth for the whole build — paste it once at the start of the session/repo (e.g., as `CLAUDE.md` or your first message), then drive phase-by-phase with short follow-ups like "Now do Phase 3."

---

```
You are acting as a senior full-stack engineer building a graded take-home assignment:
a functional Airbnb clone. Treat this as production-quality work you will personally
have to explain line-by-line in a live interview — no unexplainable AI-generated
boilerplate, no unused abstractions, no copied code from real Airbnb clone repos.

## Stack (fixed, do not deviate)
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: Python FastAPI
- Database: SQLite via SQLAlchemy (or SQLModel), with Alembic migrations
- Auth: mocked (email-only login/signup, no real password/OAuth flow, session via
  a simple token stored in an httpOnly cookie or localStorage — keep it simple and say so)
- Containerized with Docker Compose; CI via GitHub Actions

## Ground-truth product spec
[Paste PART 1 of this document here — the blueprint, schema, API design, page map]

## Non-negotiable engineering constraints
1. Snapshot price fields on Booking at creation time; never recompute historical
   booking totals from current listing price.
2. Availability is derived from confirmed Bookings, not a separate stored calendar.
3. Booking creation must be transactional and re-validate no overlapping confirmed
   booking exists at insert time (prevent race conditions), even on SQLite.
4. Every list endpoint (listings, bookings, reviews) must be paginated server-side.
5. All forms (booking, listing create/edit, review) validate both client-side
   (immediate UX feedback) and server-side (source of truth) — never trust the client.
6. No blocking `alert()`/`confirm()` — use a toast system and modals throughout.
7. Fully responsive: mobile (1 col grid, bottom-sheet filters), tablet, desktop.
8. Seed data on first run: at least 3 host users, 15–20 listings across multiple
   cities/property types with real Unsplash placeholder photo URLs, a spread of
   amenities/categories, and 5–10 pre-existing bookings (mix of past/future) so
   the app looks alive immediately, not empty.

## Build in phases — do NOT attempt all phases in one pass. After each phase,
## stop, summarize what you built, and wait for confirmation before continuing.

### Phase 0 — Scaffolding
- Initialize frontend/ (Next.js+TS+Tailwind) and backend/ (FastAPI) as siblings.
- Set up SQLAlchemy models + Alembic for the schema in the blueprint.
- Write backend/app/seed.py implementing the seed data spec above.
- docker-compose.yml wiring both services + a persisted SQLite volume.
- .env.example for both apps.

### Phase 1 — Backend core API
- Implement all /api/listings endpoints including filter query params and
  pagination.
- Implement /api/listings/{id}/availability returning booked date ranges for a
  given month.
- Implement /api/amenities and /api/categories.
- Write pytest tests for filter logic and the availability endpoint.

### Phase 2 — Booking API
- Implement POST /api/bookings with the transactional overlap-check described
  above, and the guest-facing GET /api/bookings/mine + DELETE (cancel).
- Implement GET /api/host/bookings for the host dashboard.
- Tests: overlapping booking rejected, guest count over max rejected,
  check_in >= check_out rejected.

### Phase 3 — Host CRUD API
- POST/PATCH/DELETE /api/listings restricted to the owning host (mocked auth
  check via current user id).
- Image handling: accept a list of image URLs (no real upload/cloud storage
  needed for MVP — note this as a scoped-out bonus in the README).

### Phase 4 — Frontend: Explore/Home + Search
- Header with pill search bar, CategoryRail, ListingGrid with infinite scroll,
  FiltersModal (price range, property type, amenities).
- Wire to /api/listings with all filters as URL query params so search state
  is shareable/bookmarkable.

### Phase 5 — Frontend: Listing detail + booking flow
- Photo grid hero + gallery modal, description/amenities/host section, reviews
  list, sticky BookingCard with DateRangePicker (disable booked dates from the
  availability endpoint) and GuestSelector.
- Reserve → confirmation step → creates booking → toast → redirect to My Trips.
- PriceBreakdown component (nights × rate + cleaning fee + service fee = total).

### Phase 6 — Frontend: My Trips, Wishlist, Host Dashboard
- /trips: list of guest's bookings (upcoming/past split), cancel action.
- /wishlist: saved listings grid, heart toggle synced from ListingCard.
- /host: dashboard summarizing owned listings + their bookings; /host/listings/new
  and /host/listings/[id]/edit forms with client + server validation.

### Phase 7 — Polish & DevOps
- Toast system, loading skeletons, empty states, dark mode toggle (bonus),
  mobile responsive pass on every page built so far.
- .github/workflows/ci.yml: backend lint+pytest, frontend eslint+tsc+build.
- Makefile with dev/seed/test/lint targets.
- README.md: setup instructions, architecture overview, full DB schema (with
  the reasoning for derived-availability and price-snapshotting), API overview,
  assumptions/scope-outs (real auth, real payments, real image upload,
  messaging — all explicitly listed as mocked per the assignment).

## Definition of done for the whole task
Running `docker compose up` (after `make seed`) gives an evaluator, with zero
extra setup: a browsable/searchable/filterable home grid with real seed data,
a listing detail page with working date-blocked booking, a My Trips page
showing that booking, and a host dashboard where creating/editing/deleting a
listing immediately reflects on the public grid.
```

---

### How to use this
1. Read Part 1 once yourself — you'll be asked to defend these design decisions in the interview (price snapshotting and derived availability are the two most commonly probed).
2. Paste Part 2 into your coding agent as the standing brief (or save as `CLAUDE.md`/`.cursorrules` in the repo root so it persists across sessions).
3. Drive it phase by phase — reviewing and understanding the diff after each phase — rather than asking for the whole app in one message. That's also what "you must understand every line" in the assignment is checking for.
