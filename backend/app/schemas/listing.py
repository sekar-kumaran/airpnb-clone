from datetime import datetime
from pydantic import BaseModel, Field


class ListingImageOut(BaseModel):
    id: int
    url: str
    sort_order: int

    class Config:
        from_attributes = True


class AmenityOut(BaseModel):
    id: int
    name: str
    icon: str | None = None

    class Config:
        from_attributes = True


class CategoryOut(BaseModel):
    id: int
    name: str
    icon: str | None = None

    class Config:
        from_attributes = True


class HostOut(BaseModel):
    id: int
    name: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class ListingCardOut(BaseModel):
    """Slim shape for grid/search results — avoid shipping full description/amenities per card."""
    id: int
    title: str
    city: str
    country: str
    price_per_night: float
    cover_image: str | None = None
    rating: float | None = None
    review_count: int = 0

    class Config:
        from_attributes = True


class ListingDetailOut(BaseModel):
    id: int
    host: HostOut
    title: str
    description: str
    property_type: str
    price_per_night: float
    cleaning_fee: float
    service_fee_pct: float
    city: str
    country: str
    lat: float | None = None
    lng: float | None = None
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    images: list[ListingImageOut] = []
    amenities: list[AmenityOut] = []
    categories: list[CategoryOut] = []
    rating: float | None = None
    review_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ListingCreate(BaseModel):
    title: str
    description: str
    property_type: str
    price_per_night: float = Field(gt=0)
    cleaning_fee: float = Field(default=0, ge=0)
    service_fee_pct: float = Field(default=0.12, ge=0)
    city: str
    country: str
    lat: float | None = None
    lng: float | None = None
    max_guests: int = Field(gt=0)
    bedrooms: int = Field(ge=0)
    beds: int = Field(ge=0)
    bathrooms: float = Field(ge=0)
    image_urls: list[str] = []
    amenity_ids: list[int] = []
    category_ids: list[int] = []


class ListingUpdate(BaseModel):
    """All fields optional — PATCH semantics."""
    title: str | None = None
    description: str | None = None
    property_type: str | None = None
    price_per_night: float | None = None
    cleaning_fee: float | None = None
    city: str | None = None
    country: str | None = None
    lat: float | None = None
    lng: float | None = None
    max_guests: int | None = None
    bedrooms: int | None = None
    beds: int | None = None
    bathrooms: float | None = None
    status: str | None = None
    image_urls: list[str] | None = None
    amenity_ids: list[int] | None = None
    category_ids: list[int] | None = None


class AvailabilityOut(BaseModel):
    booked_ranges: list[dict]  # [{"check_in": "2026-09-01", "check_out": "2026-09-05"}, ...]
