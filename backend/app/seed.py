"""
Seed the database with hosts, listings, images, amenities, categories,
bookings, and reviews so the app looks alive on first run.

Run with: python -m app.seed
"""
from datetime import date, timedelta

from app.db import SessionLocal, Base, engine
from app.models import User, Listing, ListingImage, Amenity, Category, Booking, Review

Base.metadata.create_all(bind=engine)

AMENITIES = [
    "Wifi",
    "Kitchen",
    "Free parking",
    "Pool",
    "Washer",
    "Air conditioning",
    "Workspace",
    "TV",
    "Hot tub",
    "Patio",
    "Ocean view",
    "Fireplace",
]

CATEGORIES = [
    ("Amazing views", "mountain"),
    ("Cabins", "cabin"),
    ("Trending", "flame"),
    ("Beachfront", "waves"),
    ("Tiny homes", "home"),
    ("Iconic cities", "city"),
    ("Tropical", "tropical"),
    ("Mansions", "mansion"),
]

LISTINGS = [
    dict(title="Apartment in North Goa", city="North Goa", country="India", property_type="Apartment", price=7692, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A bright Goan apartment close to cafes, beaches, and leafy village lanes."),
    dict(title="Flat in Nerul", city="North Goa", country="India", property_type="Apartment", price=10331, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A warm, design-led flat with a chef-friendly kitchen and quiet North Goa access."),
    dict(title="Apartment in Candolim", city="North Goa", country="India", property_type="Apartment", price=7743, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A polished Candolim stay with airy interiors and a balcony for slow mornings."),
    dict(title="Apartment in Assagao", city="North Goa", country="India", property_type="Apartment", price=6544, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="A calm Assagao apartment near restaurants, bakeries, and tropical gardens."),
    dict(title="Apartment in Anjuna", city="North Goa", country="India", property_type="Apartment", price=5750, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Pool-facing apartment for easy beach days and Anjuna evenings."),
    dict(title="Apartment in Calangute", city="North Goa", country="India", property_type="Apartment", price=6850, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Sunlit Calangute apartment with a balcony, workspace, and beach access."),
    dict(title="Flat in Anjuna", city="North Goa", country="India", property_type="Apartment", price=6081, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="A colorful Anjuna flat with bold interiors and a relaxed holiday feel."),
    dict(title="Home in Lonavala", city="Lonavala", country="India", property_type="House", price=10620, guests=6, bedrooms=3, beds=3, bathrooms=3, desc="A weekend home with open terraces, mountain air, and room for the whole group."),
    dict(title="Room in Nandgaon", city="Lonavala", country="India", property_type="Private room", price=6000, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="A cozy room with textured walls and a quiet village setting."),
    dict(title="Guest house in Lonavala", city="Lonavala", country="India", property_type="Guest house", price=25676, guests=6, bedrooms=3, beds=4, bathrooms=3, desc="Spacious guest house with a living room, kitchen, and weekend-friendly layout."),
    dict(title="Villa in Lonavala", city="Lonavala", country="India", property_type="Villa", price=42795, guests=8, bedrooms=4, beds=5, bathrooms=4, desc="A private villa with a pool deck and landscaped tropical corners."),
    dict(title="Home in Lonavala with Pool", city="Lonavala", country="India", property_type="House", price=22199, guests=8, bedrooms=4, beds=4, bathrooms=4, desc="A poolside home built for relaxed family weekends."),
    dict(title="Farm stay in Lonavala", city="Lonavala", country="India", property_type="Farm stay", price=49100, guests=10, bedrooms=5, beds=6, bathrooms=5, desc="Contemporary farm stay with dramatic architecture and wide lawns."),
    dict(title="Home in South Goa", city="South Goa", country="India", property_type="House", price=11200, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A peaceful South Goa home near palm-lined beaches and local bakeries."),
    dict(title="Villa in South Goa", city="South Goa", country="India", property_type="Villa", price=18500, guests=6, bedrooms=3, beds=3, bathrooms=3, desc="A serene villa with leafy outdoor spaces and quiet coastal access."),
    dict(title="Flat in Varanasi", city="Varanasi", country="India", property_type="Apartment", price=3603, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="A compact Varanasi flat close to old lanes, ghats, and local markets."),
    dict(title="Flat in Bhelupura", city="Varanasi", country="India", property_type="Apartment", price=4076, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Warm Bhelupura apartment with calm interiors and central access."),
    dict(title="Apartment in Varanasi", city="Varanasi", country="India", property_type="Apartment", price=3910, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Modern Varanasi apartment for families and weekend travellers."),
    dict(title="Home in Bhelupura", city="Varanasi", country="India", property_type="House", price=4793, guests=5, bedrooms=2, beds=3, bathrooms=2, desc="A comfortable home with generous living space and city access."),
    dict(title="Flat in Noida", city="Noida", country="India", property_type="Apartment", price=2719, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="A clean Noida flat with a practical kitchen and bright living area."),
    dict(title="Room in Noida", city="Noida", country="India", property_type="Private room", price=2126, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="A tidy private room with quick access to shops and transit."),
    dict(title="Flat in Greater Noida", city="Noida", country="India", property_type="Apartment", price=2500, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A soft-lit apartment in Greater Noida with work and lounge space."),
    dict(title="Apartment in Greater Noida", city="Noida", country="India", property_type="Apartment", price=2295, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="Simple, polished apartment for quick city stays."),
    dict(title="Home in New Delhi", city="New Delhi", country="India", property_type="House", price=5900, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="A calm Delhi home near heritage walks, food streets, and metro access."),
    dict(title="Carve marble with a third-generation sculptor", city="Athens", country="Greece", property_type="Experience", price=6595, guests=8, bedrooms=0, beds=0, bathrooms=1, desc="Hands-on sculpting session led by a local artist in a working studio."),
    dict(title="Sky Garden Early Access Ticket with Pastry and Drink", city="Greater London", country="United Kingdom", property_type="Experience", price=2381, guests=10, bedrooms=0, beds=0, bathrooms=1, desc="Morning skyline views followed by a pastry and drink with your host."),
    dict(title="Savor Premium Matcha in a tea ceremony in Shibuya", city="Shibuya", country="Japan", property_type="Experience", price=3591, guests=6, bedrooms=0, beds=0, bathrooms=1, desc="A guided tea ceremony with premium matcha and quiet ritual."),
    dict(title="Learn pot painting with natural cochinilla dye", city="Los Angeles", country="United States", property_type="Experience", price=4767, guests=8, bedrooms=0, beds=0, bathrooms=1, desc="Create a painted pot using natural dyes in a relaxed studio session."),
    dict(title="Discover Melbourne's acclaimed coffee culture", city="West Melbourne", country="Australia", property_type="Experience", price=5725, guests=6, bedrooms=0, beds=0, bathrooms=1, desc="Explore roasters and cafes with a host who knows the coffee scene."),
    dict(title="Learn mahjong and sip tea in Brooklyn", city="Brooklyn", country="United States", property_type="Experience", price=5721, guests=5, bedrooms=0, beds=0, bathrooms=1, desc="Learn mahjong basics over tea in a welcoming Brooklyn setting."),
    dict(title="Evening aarti walk in Varanasi", city="Varanasi", country="India", property_type="Experience", price=2100, guests=8, bedrooms=0, beds=0, bathrooms=1, desc="A hosted walk through Varanasi lanes ending near the evening aarti."),
    dict(title="New Delhi photo session by a female photographer", city="Gurgaon District", country="India", property_type="Service", price=8500, guests=4, bedrooms=0, beds=0, bathrooms=1, desc="A professional portrait session at iconic Delhi NCR locations."),
    dict(title="Makeup artistry by Sukoon", city="Gurgaon District", country="India", property_type="Service", price=2000, guests=1, bedrooms=0, beds=0, bathrooms=1, desc="Personal makeup styling for celebrations, events, or photo days."),
    dict(title="Historical photo shoot by Madhur", city="Gurgaon District", country="India", property_type="Service", price=10000, guests=4, bedrooms=0, beds=0, bathrooms=1, desc="A guided historical photo shoot with planning and edited images."),
    dict(title="Strength and mobility sessions by Mayank", city="Gurgaon District", country="India", property_type="Service", price=1800, guests=1, bedrooms=0, beds=0, bathrooms=1, desc="A practical strength and mobility session tailored to your goals."),
    dict(title="Taj Mahal Photography: Shots Worth Framing", city="Gurgaon District", country="India", property_type="Service", price=3800, guests=4, bedrooms=0, beds=0, bathrooms=1, desc="A hosted photography service for polished travel memories."),
    dict(title="Occasion ready looks by Happy", city="Dehradun", country="India", property_type="Service", price=4000, guests=1, bedrooms=0, beds=0, bathrooms=1, desc="Styling and makeup support for events, shoots, and special days."),
    dict(title="Yoga Energetic Healing", city="Dehradun", country="India", property_type="Service", price=2500, guests=6, bedrooms=0, beds=0, bathrooms=1, desc="A restorative movement and breathing session guided by a local practitioner."),
    dict(title="Sunlit Loft in the Arts District", city="Los Angeles", country="USA", property_type="Entire home", price=142, guests=4, bedrooms=2, beds=2, bathrooms=1, desc="A bright industrial loft steps from galleries, coffee shops, and late-night tacos."),
    dict(title="Cozy A-Frame Cabin by the Lake", city="Lake Tahoe", country="USA", property_type="Cabin", price=210, guests=6, bedrooms=3, beds=3, bathrooms=2, desc="Wake up to pine trees, still water, a wood stove, and a private dock."),
    dict(title="Modern Flat with Eiffel Tower View", city="Paris", country="France", property_type="Apartment", price=189, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="A compact sixth-floor flat with a private balcony facing the tower."),
    dict(title="Beachfront Bungalow", city="Canggu", country="Indonesia", property_type="Bungalow", price=76, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="Fall asleep to surf and walk two minutes to the beach cafes."),
    dict(title="Downtown High-Rise with Skyline Views", city="Chicago", country="USA", property_type="Apartment", price=165, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Floor-to-ceiling windows, a gym, and a rooftop deck above the loop."),
    dict(title="Rustic Farmhouse Retreat", city="Tuscany", country="Italy", property_type="Farmhouse", price=195, guests=8, bedrooms=4, beds=5, bathrooms=3, desc="Olive groves, a stone fireplace, and a table built for long dinners."),
    dict(title="Minimalist Studio near Shibuya", city="Tokyo", country="Japan", property_type="Private room", price=88, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="Compact, efficient, and two train stops from Shibuya Crossing."),
    dict(title="Desert Modern with Private Pool", city="Joshua Tree", country="USA", property_type="Entire home", price=230, guests=6, bedrooms=3, beds=3, bathrooms=2, desc="A stargazing deck, saltwater pool, and quiet desert mornings."),
    dict(title="Canal-Side Apartment with Bikes", city="Amsterdam", country="Netherlands", property_type="Apartment", price=158, guests=3, bedrooms=1, beds=2, bathrooms=1, desc="Sunny windows over the canal, two bikes, and a market around the corner."),
    dict(title="Garden House near Notting Hill", city="London", country="United Kingdom", property_type="House", price=205, guests=5, bedrooms=3, beds=3, bathrooms=2, desc="A calm garden home close to Portobello Road and neighborhood pubs."),
    dict(title="Clifftop Villa over the Aegean", city="Santorini", country="Greece", property_type="Villa", price=340, guests=4, bedrooms=2, beds=2, bathrooms=2, desc="Whitewashed rooms, a plunge pool, and sunset views from the terrace."),
    dict(title="Rainforest Treehouse Hideaway", city="Ubud", country="Indonesia", property_type="Tiny home", price=121, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="A handcrafted hideaway surrounded by palms, birdsong, and rice terraces."),
    dict(title="Brownstone Suite in Brooklyn", city="New York", country="USA", property_type="Private room", price=132, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="A quiet suite in a restored brownstone near parks, trains, and restaurants."),
    dict(title="Ski Chalet with Hot Tub", city="Whistler", country="Canada", property_type="Cabin", price=285, guests=8, bedrooms=4, beds=5, bathrooms=3, desc="A warm mountain chalet with gear storage and a deck hot tub."),
    dict(title="Riad Courtyard Room", city="Marrakesh", country="Morocco", property_type="Private room", price=95, guests=2, bedrooms=1, beds=1, bathrooms=1, desc="Traditional tilework, a shaded courtyard, and breakfast on the roof."),
    dict(title="Seaside Cottage on the Wild Atlantic", city="Galway", country="Ireland", property_type="House", price=148, guests=4, bedrooms=2, beds=3, bathrooms=1, desc="A simple cottage with sea air, a peat stove, and walking trails nearby."),
    dict(title="Palm Springs Mid-Century Pool Home", city="Palm Springs", country="USA", property_type="House", price=260, guests=6, bedrooms=3, beds=3, bathrooms=2, desc="Clean lines, mountain views, citrus trees, and an all-day pool scene."),
    dict(title="Harborfront Flat in Copenhagen", city="Copenhagen", country="Denmark", property_type="Apartment", price=176, guests=3, bedrooms=2, beds=2, bathrooms=1, desc="Nordic calm by the harbor, close to bakeries, ferries, and design shops."),
]

IMAGE_POOL = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
]


def _get_or_create_user(db, name: str, email: str, is_host: bool) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(name=name, email=email, is_host=is_host)
    db.add(user)
    db.flush()
    return user


def _sync_named_rows(db, model, rows):
    existing = {row.name: row for row in db.query(model).all()}
    for name, icon in rows:
        if name not in existing:
            item = model(name=name, icon=icon)
            db.add(item)
            existing[name] = item
    db.flush()
    return list(existing.values())


def _total_price(listing: Listing, nights: int) -> tuple[float, float, float]:
    cleaning_fee = listing.cleaning_fee
    subtotal = listing.price_per_night * nights + cleaning_fee
    service_fee = round(subtotal * listing.service_fee_pct, 2)
    return cleaning_fee, service_fee, round(subtotal + service_fee, 2)


def run():
    db = SessionLocal()
    try:
        amenities = _sync_named_rows(
            db,
            Amenity,
            [(name, name.lower().replace(" ", "-")) for name in AMENITIES],
        )
        categories = _sync_named_rows(db, Category, CATEGORIES)

        hosts = [
            _get_or_create_user(db, "Maya Chen", "maya@example.com", True),
            _get_or_create_user(db, "Diego Alvarez", "diego@example.com", True),
            _get_or_create_user(db, "Freja Larsen", "freja@example.com", True),
        ]
        guest = _get_or_create_user(db, "Sam Guest", "sam@example.com", False)
        db.commit()

        existing_titles = {listing.title for listing in db.query(Listing).all()}
        created = 0
        for index, data in enumerate(LISTINGS):
            if data["title"] in existing_titles:
                continue
            listing = Listing(
                host_id=hosts[index % len(hosts)].id,
                title=data["title"],
                description=data["desc"],
                property_type=data["property_type"],
                price_per_night=data["price"],
                cleaning_fee=35 + (index % 4) * 10,
                service_fee_pct=0.12,
                city=data["city"],
                country=data["country"],
                max_guests=data["guests"],
                bedrooms=data["bedrooms"],
                beds=data["beds"],
                bathrooms=data["bathrooms"],
            )
            db.add(listing)
            db.flush()

            for image_index in range(5):
                url = f"{IMAGE_POOL[(index + image_index) % len(IMAGE_POOL)]}?auto=format&fit=crop&w=1200&q=80&sig={listing.id}-{image_index}"
                db.add(ListingImage(listing_id=listing.id, url=url, sort_order=image_index))

            listing.amenities = [amenities[(index + offset) % len(amenities)] for offset in range(5)]
            listing.categories = [
                categories[index % len(categories)],
                categories[(index + 2) % len(categories)],
            ]
            created += 1

        db.commit()

        listings = db.query(Listing).order_by(Listing.id.asc()).all()
        today = date.today()
        booking_specs = [
            (0, -45, -40, 2),
            (1, 14, 18, 3),
            (2, 30, 34, 2),
            (3, -20, -16, 2),
            (4, 7, 10, 4),
            (5, 45, 51, 6),
            (6, -70, -66, 1),
            (7, 21, 24, 4),
        ]
        existing_booking_keys = {
            (booking.listing_id, booking.check_in, booking.check_out)
            for booking in db.query(Booking).all()
        }

        bookings_created = 0
        for listing_index, start_offset, end_offset, guests_count in booking_specs:
            if listing_index >= len(listings):
                continue
            listing = listings[listing_index]
            check_in = today + timedelta(days=start_offset)
            check_out = today + timedelta(days=end_offset)
            key = (listing.id, check_in, check_out)
            if key in existing_booking_keys:
                continue
            nights = (check_out - check_in).days
            cleaning_fee, service_fee, total_price = _total_price(listing, nights)
            db.add(
                Booking(
                    listing_id=listing.id,
                    guest_id=guest.id,
                    check_in=check_in,
                    check_out=check_out,
                    guests_count=guests_count,
                    nightly_rate_snapshot=listing.price_per_night,
                    cleaning_fee_snapshot=cleaning_fee,
                    service_fee_snapshot=service_fee,
                    total_price=total_price,
                    status="confirmed",
                )
            )
            bookings_created += 1

        db.commit()

        past_bookings = (
            db.query(Booking)
            .filter(Booking.guest_id == guest.id, Booking.check_out < today)
            .order_by(Booking.check_out.desc())
            .all()
        )
        reviewed_booking_ids = {review.booking_id for review in db.query(Review).all()}
        review_comments = [
            "Beautiful stay, smooth check-in, and the listing matched the photos.",
            "Great location and a thoughtful host. I would book again.",
            "Clean, comfortable, and exactly what we needed for the trip.",
        ]
        reviews_created = 0
        for index, booking in enumerate(past_bookings[:3]):
            if booking.id in reviewed_booking_ids:
                continue
            db.add(
                Review(
                    booking_id=booking.id,
                    listing_id=booking.listing_id,
                    guest_id=guest.id,
                    rating=5 - (index % 2),
                    comment=review_comments[index % len(review_comments)],
                )
            )
            reviews_created += 1

        db.commit()

        reviewed_listing_ids = {review.listing_id for review in db.query(Review).all()}
        listings_for_home = db.query(Listing).order_by(Listing.id.asc()).all()
        for index, listing in enumerate(listings_for_home):
            if listing.id in reviewed_listing_ids:
                continue
            check_in = today - timedelta(days=180 + index * 3)
            check_out = check_in + timedelta(days=2)
            nights = (check_out - check_in).days
            cleaning_fee, service_fee, total_price = _total_price(listing, nights)
            booking = Booking(
                listing_id=listing.id,
                guest_id=guest.id,
                check_in=check_in,
                check_out=check_out,
                guests_count=max(1, min(listing.max_guests, 2)),
                nightly_rate_snapshot=listing.price_per_night,
                cleaning_fee_snapshot=cleaning_fee,
                service_fee_snapshot=service_fee,
                total_price=total_price,
                status="confirmed",
            )
            db.add(booking)
            db.flush()
            db.add(
                Review(
                    booking_id=booking.id,
                    listing_id=listing.id,
                    guest_id=guest.id,
                    rating=5 if index % 5 else 4,
                    comment=review_comments[index % len(review_comments)],
                )
            )
            reviews_created += 1

        db.commit()
        total_listings = db.query(Listing).count()
        total_bookings = db.query(Booking).count()
        print(
            f"Seed ready: {total_listings} listings "
            f"({created} new), {total_bookings} bookings "
            f"({bookings_created} new), {reviews_created} new reviews."
        )
    finally:
        db.close()


if __name__ == "__main__":
    run()
