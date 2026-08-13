from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Amenity, Category
from app.schemas.listing import AmenityOut, CategoryOut

router = APIRouter(prefix="/api", tags=["meta"])


@router.get("/amenities", response_model=list[AmenityOut])
def get_amenities(db: Session = Depends(get_db)):
    return db.query(Amenity).all()


@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()
