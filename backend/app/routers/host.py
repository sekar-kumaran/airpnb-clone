from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models import User, Listing, Booking
from app.schemas.booking import BookingOut
from app.routers.deps import require_host

router = APIRouter(prefix="/api/host", tags=["host"])


@router.get("/bookings", response_model=list[BookingOut])
def host_bookings(db: Session = Depends(get_db), host: User = Depends(require_host)):
    """All bookings across every listing owned by the current host — powers the host dashboard."""
    return (
        db.query(Booking)
        .options(joinedload(Booking.listing))
        .join(Listing, Booking.listing_id == Listing.id)
        .filter(Listing.host_id == host.id)
        .order_by(Booking.check_in.desc())
        .all()
    )
