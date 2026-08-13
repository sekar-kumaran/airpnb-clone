# Airbnb Clone

A functional Airbnb-style full-stack take-home project built with Next.js,
FastAPI, and SQLite.

The app covers the main evaluator flow: browse seeded listings, search and
filter stays, open a listing detail page, reserve available dates, view trips,
save wishlists, and manage host listings.

## Tech Stack
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, SQLite
- DevOps: Docker Compose, GitHub Actions CI
- Auth: mocked email login with an `X-User-Id` request header

## Working Features
- Photo-forward explore/search grid with category rail, segmented search, filters, and pagination.
- Listing detail pages with gallery modal, amenities, reviews, and sticky booking card.
- Booking flow with visual date selection, unavailable-date indicators, confirmation modal, server-side validation, overlap rejection, and price snapshots.
- Trips page with cancellation flow using an in-app confirmation modal.
- Wishlist page and heart toggle feedback via toasts.
- Host dashboard with listing CRUD, reservation table, revenue, guest, and booking stats.
- Seed data: 18 listings across multiple cities, 3 host users, 1 guest user, 8 bookings, and reviews.
- Docker Compose setup for frontend and backend.
- CI for backend ruff/pytest and frontend lint/typecheck/build.

## Quick Start

### Docker
```bash
docker compose up --build
```

Frontend: http://localhost:3000

Backend: http://localhost:8000

API docs: http://localhost:8000/docs

### Local Development
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```

Seeded users:
- Host: `maya@example.com`
- Host: `diego@example.com`
- Host: `freja@example.com`
- Guest: `sam@example.com`

## Commands
```bash
make dev
make seed
make test
make lint
```

## Database Schema
```text
User(id, name, email, avatar_url, is_host, created_at)
Listing(id, host_id, title, description, property_type, price_per_night,
        cleaning_fee, service_fee_pct, city, country, lat, lng, max_guests,
        bedrooms, beds, bathrooms, status, created_at, updated_at)
ListingImage(id, listing_id, url, sort_order)
Amenity(id, name, icon)
ListingAmenity(listing_id, amenity_id)
Category(id, name, icon)
ListingCategory(listing_id, category_id)
Booking(id, listing_id, guest_id, check_in, check_out, guests_count,
        nightly_rate_snapshot, cleaning_fee_snapshot, service_fee_snapshot,
        total_price, status, created_at)
Review(id, booking_id, listing_id, guest_id, rating, comment, created_at)
Wishlist(id, user_id, listing_id, created_at)
```

## Architecture Notes
- Booking prices are snapshotted at creation time. If a host changes the nightly rate later, existing trip totals do not change.
- Availability is derived from confirmed bookings rather than stored in a separate calendar table. That avoids duplicated state drifting out of sync.
- Booking creation re-checks overlap inside the DB transaction. SQLite's single-writer lock is enough for this assignment; a production Postgres version should use row locking or an exclusion constraint.
- Auth is intentionally mocked for the assignment. Real password/OAuth flows are out of scope.

## Scope Outs
- No real payments.
- No real identity verification.
- No messaging.
- No real image upload; host listing forms accept image URLs.
- No production map search.
- The UI is intentionally Airbnb-inspired and close to the requested marketplace flow, without copying proprietary Airbnb code or assets.
