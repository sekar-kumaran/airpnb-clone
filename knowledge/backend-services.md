# Backend Services (FastAPI Routers)

Base: `backend/app/routers/`  
All routers mounted in `main.py` under `/api/`

---

## Auth — `routers/auth.py`

Prefix: `/api/auth`

| Method | Path | Auth Required | What it does |
|---|---|---|---|
| POST | `/signup` | No | Creates new User; 400 if email taken |
| POST | `/login` | No | Looks up user by email; 404 if not found |
| GET | `/me` | Yes (X-User-Id) | Returns current user object |

### Request/Response Shapes
```python
# POST /signup
{ name: str, email: str } → UserOut

# POST /login
{ email: str } → UserOut

# UserOut
{ id, name, email, avatar_url, is_host, created_at }
```

### Enhancement Opportunities
- Add `password_hash` field to User model + bcrypt validation on login
- Add `is_host` toggle endpoint: `PATCH /api/auth/me { is_host: bool }`
- Replace `X-User-Id` header with `httpOnly` cookie + JWT (no frontend code changes needed, only `deps.py`)
- Add Google OAuth via `authlib` or `python-social-auth`

---

## Listings — `routers/listings.py`

Prefix: `/api/listings`

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/` | No | Search + filter + paginate listings |
| GET | `/mine` | Yes | Host's own listings |
| GET | `/{id}` | No | Single listing detail |
| GET | `/{id}/availability` | No | Booked date ranges |
| POST | `/` | Host only | Create listing |
| PATCH | `/{id}` | Host + owner | Update listing |
| DELETE | `/{id}` | Host + owner | Delete listing |

### GET /api/listings — Query Params

| Param | Type | Description |
|---|---|---|
| `location` | string | Case-insensitive LIKE search on `city` |
| `min_price` | float | Minimum `price_per_night` |
| `max_price` | float | Maximum `price_per_night` |
| `property_type` | string | Exact match on `property_type` |
| `amenity_ids` | int[] | Listings must have ALL specified amenities |
| `category_id` | int | Filter by category |
| `guests` | int | `max_guests >= guests` |
| `checkin` | date | Exclude listings with confirmed bookings overlapping this range |
| `checkout` | date | (used with checkin) |
| `page` | int | Default 1 |
| `limit` | int | Default 20 |

### Response Shapes

**ListingCard** (used in search + home grids):
```python
{
    id, title, city, country, price_per_night,
    cover_image,  # first image URL
    rating,       # computed from reviews (fake fallback if no reviews)
    review_count
}
```

**ListingDetailOut** (used on listing detail page):
```python
{
    id, host (UserOut), title, description, property_type,
    price_per_night, cleaning_fee, service_fee_pct,
    city, country, lat, lng,
    max_guests, bedrooms, beds, bathrooms,
    images [{ id, url, sort_order }],
    amenities [{ id, name, icon }],
    categories [{ id, name, icon }],
    rating, review_count, created_at
}
```

### POST/PATCH /api/listings — Payload

```python
{
    title, description, property_type,
    price_per_night, cleaning_fee, service_fee_pct,
    city, country, lat, lng,
    max_guests, bedrooms, beds, bathrooms,
    image_urls: [str],    # list of image URLs
    amenity_ids: [int],
    category_ids: [int]
}
```

### Internal Helpers
- `_to_card(db, listing)` → builds ListingCard dict; uses fallback ratings if no reviews
- `_to_detail(db, listing)` → builds full detail dict

### Enhancement Opportunities
- Add `sort_by` param: `price_asc`, `price_desc`, `rating_desc`, `newest`
- Add `instant_book` boolean flag on Listing
- Add `GET /api/listings/{id}/reviews` endpoint (currently reviews not listed per listing)
- Support real image upload to S3/Cloudinary (currently URL-only)
- Add full-text search index on `title` + `description`

---

## Bookings — `routers/bookings.py`

Prefix: `/api/bookings`

| Method | Path | Auth | What it does |
|---|---|---|---|
| POST | `/` | Yes (guest) | Create booking with overlap check |
| GET | `/mine` | Yes | Guest's bookings (ordered by check_in desc) |
| DELETE | `/{id}` | Yes + owner | Cancel booking (sets status=cancelled) |

### POST /api/bookings — Validation

Server-side checks (raises 400 on failure):
1. `check_in >= check_out` → rejected
2. `guests_count > listing.max_guests` → rejected  
3. Any confirmed booking overlaps the range → rejected  
4. Overlap check runs **inside a DB transaction** to prevent race conditions

### Booking Create Payload
```python
{
    listing_id: int,
    check_in: date,      # "YYYY-MM-DD"
    check_out: date,     # "YYYY-MM-DD"
    guests_count: int
}
```

### BookingOut Shape
```python
{
    id, listing_id, guest_id, check_in, check_out, guests_count,
    nightly_rate_snapshot, cleaning_fee_snapshot, service_fee_snapshot,
    total_price, status, created_at,
    listing: { id, title, city, country, cover_image }
}
```

### Enhancement Opportunities
- Add `POST /api/bookings/{id}/review` once booking is past checkout date
- Add upcoming/past split on `/mine` endpoint: `?status=upcoming|past`
- Add host ability to decline/approve bookings (request-to-book flow)
- Send email notifications via `sendgrid` or `resend` on booking confirmed/cancelled

---

## Host — `routers/host.py`

Prefix: `/api/host`

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/bookings` | Host only | All bookings across host's listings |

### Enhancement Opportunities
- Add `GET /api/host/stats` → occupancy rate, revenue, avg rating per listing
- Add `PATCH /api/host/listings/{id}/status` → toggle active/inactive without deleting
- Add `GET /api/host/calendar` → availability grid view for host-side blocked dates

---

## Wishlist — `routers/wishlist.py`

Prefix: `/api/wishlist`

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/` | Yes | All saved listings for current user |
| POST | `/{listing_id}` | Yes | Add to wishlist; idempotent (no duplicate error) |
| DELETE | `/{listing_id}` | Yes | Remove from wishlist |

### Enhancement Opportunities
- Add **named lists**: `POST /api/wishlist/lists { name }` → multiple lists per user
- Return `is_wishlisted: bool` on ListingCard responses so heart icon syncs correctly on page load

---

## Reviews — `routers/reviews.py`

Prefix: `/api/reviews`

| Method | Path | Auth | What it does |
|---|---|---|---|
| POST | `/` | Yes | Create review for a completed booking |

### Enhancement Opportunities
- Add `GET /api/listings/{id}/reviews?page=1&limit=10` for paginated reviews
- Enforce "only after checkout date" — check `booking.check_out < today`
- Add host review of guest (two-way review system like real Airbnb)
- Add photo upload to reviews

---

## Meta — `routers/meta.py`

Prefix: `/api`

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/amenities` | No | List all amenities (id, name, icon) |
| GET | `/categories` | No | List all categories (id, name, icon) |

Used by:
- Filter modal (amenities checklist)
- Host listing form (amenity/category selectors)
- Category rail on homepage

---

## Dependency Injection — `routers/deps.py`

```python
def get_current_user(db, x_user_id: str = Header(None)) -> User:
    # Reads X-User-Id header → queries User → raises 401 if not found

def require_host(user = Depends(get_current_user)) -> User:
    # Same as get_current_user + checks user.is_host == True → raises 403 if not
```

---

## CRUD Helpers — `crud/`

| File | Functions |
|---|---|
| `crud/listings.py` | `list_listings()`, `get_listing()`, `rating_for_listing()` |
| `crud/bookings.py` | `create_booking()` (transactional), `get_booked_ranges()`, `BookingError` |
