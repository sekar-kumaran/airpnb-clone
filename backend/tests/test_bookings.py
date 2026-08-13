from datetime import date, timedelta

from app.models import User, Listing


def _make_host_and_listing(db_session):
    host = User(name="Host", email="host@test.com", is_host=True)
    db_session.add(host)
    db_session.flush()
    listing = Listing(
        host_id=host.id, title="Test Place", description="desc", property_type="Entire home",
        price_per_night=100, cleaning_fee=20, city="Testville", country="Testland", max_guests=4,
    )
    db_session.add(listing)
    guest = User(name="Guest", email="guest@test.com", is_host=False)
    db_session.add(guest)
    db_session.commit()
    return host, listing, guest


def test_create_booking_success(client, db_session):
    host, listing, guest = _make_host_and_listing(db_session)
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=3)

    resp = client.post("/api/bookings", json={
        "listing_id": listing.id, "check_in": str(check_in), "check_out": str(check_out), "guests_count": 2,
    }, headers={"X-User-Id": str(guest.id)})

    assert resp.status_code == 201
    body = resp.json()
    assert body["total_price"] == 100 * 3 + 20 + round((100 * 3 + 20) * 0.12, 2)


def test_overlapping_booking_rejected(client, db_session):
    host, listing, guest = _make_host_and_listing(db_session)
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=3)
    headers = {"X-User-Id": str(guest.id)}

    first = client.post("/api/bookings", json={
        "listing_id": listing.id, "check_in": str(check_in), "check_out": str(check_out), "guests_count": 2,
    }, headers=headers)
    assert first.status_code == 201

    overlapping_in = check_in + timedelta(days=1)
    overlapping_out = check_out + timedelta(days=1)
    second = client.post("/api/bookings", json={
        "listing_id": listing.id, "check_in": str(overlapping_in), "check_out": str(overlapping_out), "guests_count": 2,
    }, headers=headers)
    assert second.status_code == 400
    assert "overlap" in second.json()["detail"].lower()


def test_guests_over_max_rejected(client, db_session):
    host, listing, guest = _make_host_and_listing(db_session)
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=2)

    resp = client.post("/api/bookings", json={
        "listing_id": listing.id, "check_in": str(check_in), "check_out": str(check_out), "guests_count": 99,
    }, headers={"X-User-Id": str(guest.id)})
    assert resp.status_code == 400


def test_checkin_after_checkout_rejected_by_schema(client, db_session):
    host, listing, guest = _make_host_and_listing(db_session)
    check_in = date.today() + timedelta(days=10)
    resp = client.post("/api/bookings", json={
        "listing_id": listing.id, "check_in": str(check_in), "check_out": str(check_in - timedelta(days=1)), "guests_count": 1,
    }, headers={"X-User-Id": str(guest.id)})
    assert resp.status_code == 422  # pydantic validation error
