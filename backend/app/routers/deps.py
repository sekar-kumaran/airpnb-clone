"""
Mocked-auth dependency shared by routers.

Real Airbnb uses full OAuth/password auth — explicitly out of scope per the
assignment. We simulate "logged in" via a header the frontend sends after a
mocked /auth/login call: `X-User-Id: <int>`. This is intentionally simple;
swap for real JWT/session auth only if you have time left after core features.
"""
from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User


def get_current_user(x_user_id: int | None = Header(default=None), db: Session = Depends(get_db)) -> User:
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated (missing X-User-Id header)")
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return user


def require_host(user: User = Depends(get_current_user)) -> User:
    if not user.is_host:
        raise HTTPException(status_code=403, detail="Host account required")
    return user
