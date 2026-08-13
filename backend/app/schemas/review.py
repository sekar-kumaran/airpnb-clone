from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    booking_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    rating: int
    comment: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
