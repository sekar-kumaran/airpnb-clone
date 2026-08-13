from datetime import date as date_type
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import Listing, Amenity, Category, Review, Booking


def get_listing_query(db: Session):
    return db.query(Listing).options(
        joinedload(Listing.images),
        joinedload(Listing.amenities),
        joinedload(Listing.categories),
        joinedload(Listing.host),
    )


def list_listings(
    db: Session,
    location: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    property_type: str | None = None,
    amenity_ids: list[int] | None = None,
    category_id: int | None = None,
    guests: int | None = None,
    checkin: date_type | None = None,
    checkout: date_type | None = None,
    page: int = 1,
    limit: int = 20,
):
    """
    Returns (listings, total_count) for the given filters, paginated.
    """
    query = get_listing_query(db).filter(Listing.status == "active")

    if location:
        like = f"%{location}%"
        query = query.filter((Listing.city.ilike(like)) | (Listing.country.ilike(like)))
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)
    if property_type:
        query = query.filter(Listing.property_type == property_type)
    if guests is not None:
        query = query.filter(Listing.max_guests >= guests)
    if amenity_ids:
        for amenity_id in amenity_ids:
            query = query.filter(Listing.amenities.any(Amenity.id == amenity_id))
    if category_id is not None:
        query = query.filter(Listing.categories.any(Category.id == category_id))
    if checkin and checkout:
        unavailable_subquery = (
            db.query(Booking.listing_id)
            .filter(
                Booking.status == "confirmed",
                Booking.check_in < checkout,
                Booking.check_out > checkin,
            )
        )
        query = query.filter(~Listing.id.in_(unavailable_subquery))

    total = query.count()
    listings = (
        query.order_by(Listing.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return listings, total


def get_listing(db: Session, listing_id: int):
    return get_listing_query(db).filter(Listing.id == listing_id).first()


def rating_for_listing(db: Session, listing_id: int) -> tuple[float | None, int]:
    row = (
        db.query(func.avg(Review.rating), func.count(Review.id))
        .filter(Review.listing_id == listing_id)
        .first()
    )
    avg_rating, count = row
    return (round(avg_rating, 2) if avg_rating else None, count or 0)
