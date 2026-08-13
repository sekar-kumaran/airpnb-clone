from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db import Base


class Booking(Base):
    """
    Price fields are SNAPSHOTTED at booking time (copied from the listing,
    not referenced live) so that a host changing their nightly rate later
    never retroactively changes what a guest's past/upcoming trip costs.
    Availability is intentionally NOT a separate table — it's derived by
    querying confirmed bookings for date overlap. See app/crud/bookings.py.
    """
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guests_count = Column(Integer, nullable=False)

    nightly_rate_snapshot = Column(Float, nullable=False)
    cleaning_fee_snapshot = Column(Float, nullable=False)
    service_fee_snapshot = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    status = Column(String, default="confirmed")  # confirmed | cancelled

    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False, cascade="all, delete-orphan")
