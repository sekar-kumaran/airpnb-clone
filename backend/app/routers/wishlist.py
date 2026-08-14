from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import get_db
from app.models import User, Wishlist, Listing
from app.routers.deps import get_current_user
from app.routers.listings import _to_card

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])

class WishlistAddRequest(BaseModel):
    folder_name: str = "Wishlist"

@router.get("")
def get_wishlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Returns ALL saved listings across all folders (used for the global heart icon state)
    items = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    listings = [db.query(Listing).filter(Listing.id == w.listing_id).first() for w in items]
    # Remove duplicates if a listing is saved in multiple folders
    unique_listings = {l.id: l for l in listings if l}.values()
    return [_to_card(db, listing) for listing in unique_listings]

@router.get("/folders")
def get_wishlist_folders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Group by folder_name
    folders = db.query(
        Wishlist.folder_name, 
        func.count(Wishlist.id).label("count")
    ).filter(Wishlist.user_id == user.id).group_by(Wishlist.folder_name).all()
    
    result = []
    for f in folders:
        # Get the first listing in this folder for the cover image
        first_item = db.query(Wishlist).filter(
            Wishlist.user_id == user.id, 
            Wishlist.folder_name == f.folder_name
        ).order_by(Wishlist.created_at.desc()).first()
        
        cover_image = None
        if first_item:
            listing = db.query(Listing).filter(Listing.id == first_item.listing_id).first()
            if listing and listing.images:
                cover_image = listing.images[0].url
                
        result.append({
            "name": f.folder_name,
            "count": f.count,
            "cover_image": cover_image
        })
    return result

@router.get("/folders/{folder_name}")
def get_wishlist_folder_items(folder_name: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    items = db.query(Wishlist).filter(
        Wishlist.user_id == user.id, 
        Wishlist.folder_name == folder_name
    ).all()
    listings = [db.query(Listing).filter(Listing.id == w.listing_id).first() for w in items]
    return [_to_card(db, listing) for listing in listings if listing]

@router.post("/{listing_id}", status_code=201)
def add_to_wishlist(listing_id: int, req: WishlistAddRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Listing).filter(Listing.id == listing_id).first():
        raise HTTPException(status_code=404, detail="Listing not found")
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == user.id, 
        Wishlist.listing_id == listing_id,
        Wishlist.folder_name == req.folder_name
    ).first()
    if existing:
        return {"status": "already saved in this folder"}
    db.add(Wishlist(user_id=user.id, listing_id=listing_id, folder_name=req.folder_name))
    db.commit()
    return {"status": "saved"}

@router.delete("/{listing_id}", status_code=204)
def remove_from_wishlist(listing_id: int, folder_name: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.listing_id == listing_id)
    if folder_name:
        query = query.filter(Wishlist.folder_name == folder_name)
        
    items = query.all()
    if items:
        for item in items:
            db.delete(item)
        db.commit()
    return None
