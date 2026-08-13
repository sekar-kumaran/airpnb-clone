# Project Overview — Airbnb Clone

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 App Router + TypeScript | `frontend/` |
| Styling | Tailwind CSS | Config at `frontend/tailwind.config.ts` |
| Backend | Python FastAPI | `backend/` |
| Database | SQLite via SQLAlchemy | File: `backend/app.db` |
| Auth | Mocked (email-only) | `X-User-Id` header, no JWT |
| Containerization | Docker Compose | `docker-compose.yml` |
| CI | GitHub Actions | `.github/workflows/` |

---

## Directory Layout

```
airbnb-clone/
├── frontend/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # / → HomePageContent
│   │   ├── layout.tsx              # Root layout + Header + ToastProvider
│   │   ├── homes/page.tsx          # /homes
│   │   ├── experiences/page.tsx    # /experiences
│   │   ├── services/page.tsx       # /services
│   │   ├── search/page.tsx         # /search?location=...
│   │   ├── listing/[id]/page.tsx   # /listing/:id
│   │   ├── trips/page.tsx          # /trips (My Trips)
│   │   ├── wishlist/page.tsx       # /wishlist
│   │   ├── host/page.tsx           # /host (Host Dashboard)
│   │   ├── login/page.tsx          # /login (mocked auth)
│   │   └── signup/page.tsx         # /signup (mocked auth)
│   ├── components/                 # Shared UI components
│   ├── lib/api-client.ts           # Fetch wrapper + API methods
│   └── types/                      # TypeScript type definitions
├── backend/
│   └── app/
│       ├── main.py                 # FastAPI app + CORS + router includes
│       ├── db.py                   # SQLAlchemy engine + Base + get_db
│       ├── config.py               # Settings (env vars)
│       ├── seed.py                 # Seed: 3 hosts, ~20 listings, bookings
│       ├── models/                 # SQLAlchemy ORM models
│       ├── schemas/                # Pydantic request/response schemas
│       ├── routers/                # FastAPI route handlers
│       └── crud/                   # DB query helpers
```

---

## Data Flow

```
Browser → Next.js page (server component)
       → api-client.ts → fetch() → FastAPI router
       → CRUD helper → SQLAlchemy → SQLite
```

- **Server components** (pages) call `api-client.ts` directly (Node.js runtime)
- **Client components** (interactive parts like BookingCard, Header) also call `api-client.ts` from the browser
- Auth: `localStorage.getItem("userId")` → passed as `X-User-Id` header on every request
- No cookies, no JWT tokens in MVP

---

## Auth Model (Mocked)

1. `POST /api/auth/signup` → creates `User` row, returns `{id, name, email}`
2. `POST /api/auth/login` → looks up by email, returns user
3. Frontend stores `user.id` in `localStorage` as `"userId"`
4. Every subsequent API call sends `X-User-Id: <id>` header
5. Backend `deps.py` reads this header → returns `User` object or raises 401

**To upgrade**: swap `X-User-Id` header for `httpOnly` cookie + JWT. No other code changes needed.

---

## Design Tokens (Airbnb Brand)

| Token | Value | Usage |
|---|---|---|
| Primary (Rausch) | `#FF385C` | CTA buttons, active states, logo |
| Primary Dark | `#E00B41` | Hover state on primary |
| Gray 900 | `#222222` | Main text |
| Gray 700 | `#6C6C6C` | Secondary text |
| Gray 400 | `#DDDDDD` | Borders |
| Gray 100 | `#F7F7F7` | Backgrounds |
| Border Radius | `rounded-2xl` (16px), `rounded-full` | Cards, pills, modals |
| Font | System default (Airbnb Cereal not available; swap to `Inter` for clone) |

---

## Key Engineering Decisions

| Decision | Reason |
|---|---|
| Availability derived from Bookings (no calendar table) | No redundant state, cannot drift out of sync |
| Price snapshot on Booking creation | Host price changes cannot alter historical bookings |
| Booking overlap check inside DB transaction | Prevents double-booking race conditions |
| SQLite for MVP | Zero config, portable; swap Postgres for production |
| Paginated list endpoints | All listing/booking lists have `page` + `limit` params |
