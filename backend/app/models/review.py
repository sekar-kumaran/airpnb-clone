from datetime import datetime

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db import Base


class Review(Base):
    """
    Tied to a specific Booking (not just listing+user) so we can enforce
    "one review per completed stay" via the unique constraint below, and so
    a review can only be left after a real booking exists (bonus feature:
    "leave a review after a completed stay").
    """
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("booking_id", name="uq_review_per_booking"),)

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="review")
    listing = relationship("Listing", back_populates="reviews")
    guest = relationship("User", back_populates="reviews")
