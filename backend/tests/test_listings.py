from app.models import User, Listing


def test_list_listings_empty(client):
    resp = client.get("/api/listings")
    assert resp.status_code == 200
    assert resp.json()["results"] == []
    assert resp.json()["total"] == 0


def test_filter_by_price(client, db_session):
    host = User(name="Host", email="h@test.com", is_host=True)
    db_session.add(host)
    db_session.flush()
    cheap = Listing(host_id=host.id, title="Cheap", description="d", property_type="Entire home",
                     price_per_night=50, city="A", country="A", max_guests=2)
    pricey = Listing(host_id=host.id, title="Pricey", description="d", property_type="Entire home",
                      price_per_night=500, city="A", country="A", max_guests=2)
    db_session.add_all([cheap, pricey])
    db_session.commit()

    resp = client.get("/api/listings", params={"max_price": 100})
    assert resp.status_code == 200
    titles = [r["title"] for r in resp.json()["results"]]
    assert "Cheap" in titles
    assert "Pricey" not in titles
