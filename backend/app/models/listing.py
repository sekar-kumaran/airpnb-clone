from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship

from app.db import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    property_type = Column(String, nullable=False)  # e.g. "Entire home", "Private room", "Cabin"

    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee_pct = Column(Float, default=0.12)  # 12% platform fee, matches Airbnb ballpark

    city = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Float, default=1)

    status = Column(String, default="active")  # active | inactive

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    host = relationship("User", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.sort_order")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    amenities = relationship("Amenity", secondary="listing_amenities", back_populates="listings")
    categories = relationship("Category", secondary="listing_categories", back_populates="listings")

    @property
    def cover_image(self) -> str | None:
        return self.images[0].url if self.images else None

    @property
    def location(self) -> str:
        return f"{self.city}, {self.country}"


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    url = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="images")
