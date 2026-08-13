from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db import get_db
from app.models import User, Booking, Review
from app.schemas.review import ReviewCreate, ReviewOut
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("", response_model=ReviewOut, status_code=201)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.guest_id != user.id:
        raise HTTPException(status_code=403, detail="Not your booking")
    if booking.check_out > date.today():
        raise HTTPException(status_code=400, detail="You can only review a stay after checkout")
    if booking.review:
        raise HTTPException(status_code=400, detail="You already reviewed this stay")

    review = Review(
        booking_id=booking.id, listing_id=booking.listing_id, guest_id=user.id,
        rating=payload.rating, comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
