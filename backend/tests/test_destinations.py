def test_list_destinations(client):
    resp = client.get("/api/destinations")
    assert resp.status_code == 200
    destinations = resp.json()
    assert len(destinations) == 12
    ids = {d["id"] for d in destinations}
    assert "hyderabad" in ids and "goa" in ids


def test_list_destinations_popular_filter(client):
    resp = client.get("/api/destinations", params={"popular": True})
    assert resp.status_code == 200
    destinations = resp.json()
    assert len(destinations) > 0
    assert all(d["popular"] for d in destinations)


def test_get_destination_detail(client):
    resp = client.get("/api/destinations/hyderabad")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Hyderabad"
    assert "sceneType" in body and "bestFor" in body


def test_get_destination_not_found(client):
    resp = client.get("/api/destinations/nowhere")
    assert resp.status_code == 404


def test_get_destination_attractions(client):
    resp = client.get("/api/destinations/hyderabad/attractions")
    assert resp.status_code == 200
    attractions = resp.json()
    assert len(attractions) > 0
    assert all(a["destinationId"] == "hyderabad" for a in attractions)


def test_get_destination_attractions_for_missing_destination_404(client):
    resp = client.get("/api/destinations/nowhere/attractions")
    assert resp.status_code == 404
