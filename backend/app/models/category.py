from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.db import Base

listing_categories = Table(
    "listing_categories",
    Base.metadata,
    Column("listing_id", Integer, ForeignKey("listings.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)


class Category(Base):
    """The horizontally-scrolling category rail on the home page."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # "Amazing views", "Cabins", "Trending"...
    icon = Column(String, nullable=True)

    listings = relationship("Listing", secondary=listing_categories, back_populates="categories")
