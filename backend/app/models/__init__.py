# Import every model here so Base.metadata.create_all() (called in main.py)
# discovers all tables, and so `from app.models import Listing` etc. works.
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.amenity import Amenity, listing_amenities
from app.models.category import Category, listing_categories
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist

__all__ = [
    "User",
    "Listing",
    "ListingImage",
    "Amenity",
    "listing_amenities",
    "Category",
    "listing_categories",
    "Booking",
    "Review",
    "Wishlist",
]
