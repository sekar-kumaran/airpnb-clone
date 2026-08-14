from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.config import settings
from app.routers import auth, listings, bookings, host, wishlist, reviews, meta

# MVP schema management: create_all() on startup. If you need real migrations
# (e.g. altering an existing populated DB), add Alembic — noted as optional
# in the master prompt, not required for this assignment's scope.
Base.metadata.create_all(bind=engine)
if settings.seed_on_start:
    from app.seed import run as seed_database

    seed_database()

app = FastAPI(title="Airbnb Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(host.router)
app.include_router(wishlist.router)
app.include_router(reviews.router)
app.include_router(meta.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
