from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.db import Base

listing_amenities = Table(
    "listing_amenities",
    Base.metadata,
    Column("listing_id", Integer, ForeignKey("listings.id"), primary_key=True),
    Column("amenity_id", Integer, ForeignKey("amenities.id"), primary_key=True),
)


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # "Wifi", "Kitchen", "Free parking"...
    icon = Column(String, nullable=True)  # icon name/key the frontend maps to a lucide-react icon

    listings = relationship("Listing", secondary=listing_amenities, back_populates="amenities")
