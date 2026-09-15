def test_create_trip(created_trip):
    assert created_trip["destinationId"] == "hyderabad"
    assert created_trip["budgetMax"] == 3000
    assert created_trip["hasItinerary"] is False
    assert "id" in created_trip and "createdAt" in created_trip


def test_create_trip_missing_fields_returns_422(client):
    resp = client.post("/api/trips", json={"destinationId": "hyderabad"})
    assert resp.status_code == 422
    assert "detail" in resp.json()


def test_list_trips(client, created_trip):
    resp = client.get("/api/trips")
    assert resp.status_code == 200
    trips = resp.json()
    assert any(t["id"] == created_trip["id"] for t in trips)


def test_get_trip_by_id(client, created_trip):
    resp = client.get(f"/api/trips/{created_trip['id']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == created_trip["id"]


def test_get_trip_not_found(client):
    resp = client.get("/api/trips/does-not-exist")
    assert resp.status_code == 404
    assert resp.json() == {"detail": "Trip 'does-not-exist' not found"}


def test_update_trip(client, created_trip):
    resp = client.put(f"/api/trips/{created_trip['id']}", json={"budgetMax": 5000})
    assert resp.status_code == 200
    body = resp.json()
    assert body["budgetMax"] == 5000
    # unrelated fields untouched
    assert body["destinationId"] == "hyderabad"


def test_delete_trip(client, created_trip):
    trip_id = created_trip["id"]
    resp = client.delete(f"/api/trips/{trip_id}")
    assert resp.status_code == 204

    resp = client.get(f"/api/trips/{trip_id}")
    assert resp.status_code == 404


def test_generate_itinerary(client, created_trip):
    trip_id = created_trip["id"]
    resp = client.post(f"/api/trips/{trip_id}/generate")
    assert resp.status_code == 200
    itinerary = resp.json()

    assert itinerary["input"]["destinationId"] == "hyderabad"
    assert len(itinerary["days"]) == created_trip["durationDays"]
    assert itinerary["totals"]["placeCount"] > 0
    for score in itinerary["scores"].values():
        assert 0 <= score <= 100

    # trip now reports it has an itinerary
    trip_resp = client.get(f"/api/trips/{trip_id}")
    assert trip_resp.json()["hasItinerary"] is True


def test_generate_itinerary_for_missing_trip_404(client):
    resp = client.post("/api/trips/does-not-exist/generate")
    assert resp.status_code == 404
