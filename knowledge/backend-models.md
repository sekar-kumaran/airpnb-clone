# Backend Models — SQLAlchemy ORM

File: `backend/app/models/`

---

## User (`models/user.py`)

```python
class User(Base):
    __tablename__ = "users"
    id           = Integer PK
    name         = String, not null
    email        = String, unique, not null, indexed
    avatar_url   = String, nullable
    is_host      = Boolean, default False
    created_at   = DateTime, utcnow

    # Relationships
    listings  → List[Listing]     (back_populates="host")
    bookings  → List[Booking]     (as guest, back_populates="guest")
    reviews   → List[Review]      (back_populates="guest")
    wishlists → List[Wishlist]    (back_populates="user")
```

---

## Listing (`models/listing.py`)

```python
class Listing(Base):
    __tablename__ = "listings"
    id               = Integer PK
    host_id          = FK → users.id, not null
    title            = String, not null
    description      = Text, not null
    property_type    = String ("Entire home" | "Private room" | "Cabin" | "Experience" | "Service")
    price_per_night  = Float, not null
    cleaning_fee     = Float, default 0.0
    service_fee_pct  = Float, default 0.12   # 12% platform fee
    city             = String, not null, indexed
    country          = String, not null
    lat              = Float, nullable
    lng              = Float, nullable
    max_guests       = Integer, default 2
    bedrooms         = Integer, default 1
    beds             = Integer, default 1
    bathrooms        = Float, default 1
    status           = String ("active" | "inactive"), default "active"
    created_at       = DateTime, utcnow
    updated_at       = DateTime, utcnow, onupdate

    # Relationships
    host       → User              (back_populates="listings")
    images     → List[ListingImage]  (cascade delete, ordered by sort_order)
    bookings   → List[Booking]     (cascade delete)
    reviews    → List[Review]      (cascade delete)
    amenities  → List[Amenity]     (M2M via listing_amenities join table)
    categories → List[Category]    (M2M via listing_categories join table)

    # Properties
    cover_image → images[0].url if images else None
    location    → "{city}, {country}"
```

### ListingImage

```python
class ListingImage(Base):
    __tablename__ = "listing_images"
    id          = Integer PK
    listing_id  = FK → listings.id
    url         = String, not null
    sort_order  = Integer, default 0
```

---

## Amenity (`models/amenity.py`)

```python
class Amenity(Base):
    __tablename__ = "amenities"
    id    = Integer PK
    name  = String, unique
    icon  = String, nullable   # icon name or emoji

    listings → List[Listing]   (M2M via listing_amenities)
```

---

## Category (`models/category.py`)

```python
class Category(Base):
    __tablename__ = "categories"
    id    = Integer PK
    name  = String, unique     # "Amazing views", "Cabins", "Trending"…
    icon  = String, nullable

    listings → List[Listing]   (M2M via listing_categories)
```

---

## Booking (`models/booking.py`)

```python
class Booking(Base):
    __tablename__ = "bookings"
    id                      = Integer PK
    listing_id              = FK → listings.id, not null
    guest_id                = FK → users.id, not null
    check_in                = Date, not null
    check_out               = Date, not null
    guests_count            = Integer, not null
    nightly_rate_snapshot   = Float     # price at booking time
    cleaning_fee_snapshot   = Float
    service_fee_snapshot    = Float
    total_price             = Float
    status                  = String ("confirmed" | "cancelled"), default "confirmed"
    created_at              = DateTime, utcnow

    listing → Listing   (back_populates="bookings")
    guest   → User      (back_populates="bookings")
    review  → Review    (back_populates="booking")
```

> **CRITICAL**: Price fields are **snapshotted** at creation time — `nightly_rate_snapshot`, `cleaning_fee_snapshot`, `service_fee_snapshot`. If the host changes pricing, past bookings are unaffected. This is a deliberate schema design decision.

---

## Review (`models/review.py`)

```python
class Review(Base):
    __tablename__ = "reviews"
    id          = Integer PK
    booking_id  = FK → bookings.id, unique   # 1 review per booking
    listing_id  = FK → listings.id
    guest_id    = FK → users.id
    rating      = Integer (1–5), not null
    comment     = Text, nullable
    created_at  = DateTime, utcnow

    booking → Booking   (back_populates="review")
    listing → Listing   (back_populates="reviews")
    guest   → User      (back_populates="reviews")
```

---

## Wishlist (`models/wishlist.py`)

```python
class Wishlist(Base):
    __tablename__ = "wishlists"
    id          = Integer PK
    user_id     = FK → users.id
    listing_id  = FK → listings.id
    created_at  = DateTime, utcnow

    user    → User     (back_populates="wishlists")
    listing → Listing
```

---

## Join Tables (defined in `models/__init__.py`)

```python
listing_amenities  = Table(listing_id FK, amenity_id FK)
listing_categories = Table(listing_id FK, category_id FK)
```

---

## Availability Logic (No Separate Calendar Table)

Availability is **derived** at query time:

```python
# A date is unavailable if any confirmed booking overlaps it
booked_ranges = db.query(Booking).filter(
    Booking.listing_id == listing_id,
    Booking.status == "confirmed"
).all()
```

The frontend receives these ranges and disables dates in the calendar picker.

### Enhancement: Add Blocked Dates Table
For host-initiated unavailability (e.g., "blocked for maintenance"), add:
```python
class BlockedDate(Base):
    listing_id, start_date, end_date, reason
```
Merge with booked ranges when returning availability.
