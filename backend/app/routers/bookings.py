from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models import User, Booking
from app.schemas.booking import BookingCreate, BookingOut
from app.crud.bookings import create_booking, BookingError
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingOut, status_code=201)
def book(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        booking = create_booking(
            db, listing_id=payload.listing_id, guest_id=user.id,
            check_in=payload.check_in, check_out=payload.check_out,
            guests_count=payload.guests_count,
        )
    except BookingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    # Reload with listing relationship for response
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.listing))
        .filter(Booking.id == booking.id)
        .first()
    )
    return booking


@router.get("/mine", response_model=list[BookingOut])
def my_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(Booking)
        .options(joinedload(Booking.listing))
        .filter(Booking.guest_id == user.id)
        .order_by(Booking.check_in.desc())
        .all()
    )


@router.delete("/{booking_id}", response_model=BookingOut)
def cancel_booking(booking_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.listing))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.guest_id != user.id:
        raise HTTPException(status_code=403, detail="Not your booking")
    booking.status = "cancelled"
    db.commit()
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.listing))
        .filter(Booking.id == booking_id)
        .first()
    )
    return booking
