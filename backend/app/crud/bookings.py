from datetime import date

from sqlalchemy.orm import Session

from app.models import Booking, Listing


class BookingError(Exception):
    """Raised for any booking validation failure; routers map this to HTTP 400."""
    pass


def get_booked_ranges(db: Session, listing_id: int) -> list[Booking]:
    """All CONFIRMED bookings for a listing — this IS the availability calendar.
    We deliberately do not persist a separate availability table; it would be
    redundant state that could drift out of sync with the bookings table."""
    return (
        db.query(Booking)
        .filter(Booking.listing_id == listing_id, Booking.status == "confirmed")
        .all()
    )


def _ranges_overlap(a_start: date, a_end: date, b_start: date, b_end: date) -> bool:
    # Half-open intervals [check_in, check_out) — a checkout on the same day
    # as another guest's check-in is allowed, matching real Airbnb behavior.
    return a_start < b_end and b_start < a_end


def create_booking(db: Session, listing_id: int, guest_id: int, check_in: date, check_out: date, guests_count: int) -> Booking:
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise BookingError("Listing not found")
    if listing.status != "active":
        raise BookingError("Listing is not available for booking")
    if guests_count > listing.max_guests:
        raise BookingError(f"This listing sleeps a maximum of {listing.max_guests} guests")

    # TRANSACTIONAL overlap re-check: SQLAlchemy's session + this query running
    # inside the same DB transaction as the insert below prevents two nearly-
    # simultaneous requests from both passing the check and double-booking the
    # same dates. For SQLite this is enforced by the single-writer lock; for a
    # multi-writer DB (Postgres) you'd additionally want SELECT ... FOR UPDATE
    # or a DB-level exclusion constraint — call this out in the interview.
    existing = (
        db.query(Booking)
        .filter(Booking.listing_id == listing_id, Booking.status == "confirmed")
        .all()
    )
    for b in existing:
        if _ranges_overlap(check_in, check_out, b.check_in, b.check_out):
            raise BookingError("Selected dates overlap an existing booking")

    nights = (check_out - check_in).days
    nightly_rate_snapshot = listing.price_per_night
    cleaning_fee_snapshot = listing.cleaning_fee
    subtotal = nightly_rate_snapshot * nights + cleaning_fee_snapshot
    service_fee_snapshot = round(subtotal * listing.service_fee_pct, 2)
    total_price = round(subtotal + service_fee_snapshot, 2)

    booking = Booking(
        listing_id=listing_id,
        guest_id=guest_id,
        check_in=check_in,
        check_out=check_out,
        guests_count=guests_count,
        nightly_rate_snapshot=nightly_rate_snapshot,
        cleaning_fee_snapshot=cleaning_fee_snapshot,
        service_fee_snapshot=service_fee_snapshot,
        total_price=total_price,
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
