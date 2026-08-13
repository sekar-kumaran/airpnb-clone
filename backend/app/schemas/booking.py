from datetime import date, datetime
from pydantic import BaseModel, model_validator


class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests_count: int

    @model_validator(mode="after")
    def validate_dates(self):
        if self.check_in >= self.check_out:
            raise ValueError("check_out must be after check_in")
        if self.check_in < date.today():
            raise ValueError("check_in cannot be in the past")
        return self


class BookingListingOut(BaseModel):
    id: int
    title: str
    city: str
    country: str
    location: str
    cover_image: str | None = None

    class Config:
        from_attributes = True


class BookingOut(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests_count: int
    nightly_rate_snapshot: float
    cleaning_fee_snapshot: float
    service_fee_snapshot: float
    total_price: float
    status: str
    created_at: datetime
    listing: BookingListingOut | None = None

    class Config:
        from_attributes = True
