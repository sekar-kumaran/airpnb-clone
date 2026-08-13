from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, Wishlist, Listing
from app.routers.deps import get_current_user
from app.routers.listings import _to_card

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("")
def get_wishlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    items = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    listings = [db.query(Listing).filter(Listing.id == w.listing_id).first() for w in items]
    return [_to_card(db, listing) for listing in listings if listing]


@router.post("/{listing_id}", status_code=201)
def add_to_wishlist(listing_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Listing).filter(Listing.id == listing_id).first():
        raise HTTPException(status_code=404, detail="Listing not found")
    existing = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.listing_id == listing_id).first()
    if existing:
        return {"status": "already saved"}
    db.add(Wishlist(user_id=user.id, listing_id=listing_id))
    db.commit()
    return {"status": "saved"}


@router.delete("/{listing_id}", status_code=204)
def remove_from_wishlist(listing_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.listing_id == listing_id).first()
    if item:
        db.delete(item)
        db.commit()
    return None
