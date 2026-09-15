import pytest


@pytest.fixture()
def generated_itinerary(client, created_trip):
    resp = client.post(f"/api/trips/{created_trip['id']}/generate")
    assert resp.status_code == 200
    return created_trip, resp.json()


def test_get_itinerary(client, generated_itinerary):
    trip, itinerary = generated_itinerary
    resp = client.get(f"/api/trips/{trip['id']}/itinerary")
    assert resp.status_code == 200
    assert resp.json()["id"] == itinerary["id"]


def test_get_itinerary_before_generate_404(client, created_trip):
    resp = client.get(f"/api/trips/{created_trip['id']}/itinerary")
    assert resp.status_code == 404


def test_get_itinerary_day(client, generated_itinerary):
    trip, _ = generated_itinerary
    resp = client.get(f"/api/trips/{trip['id']}/itinerary/day/1")
    assert resp.status_code == 200
    assert resp.json()["dayNumber"] == 1


def test_get_itinerary_day_not_found(client, generated_itinerary):
    trip, _ = generated_itinerary
    resp = client.get(f"/api/trips/{trip['id']}/itinerary/day/99")
    assert resp.status_code == 404


def test_constraint_check(client, generated_itinerary):
    trip, _ = generated_itinerary
    resp = client.post(f"/api/trips/{trip['id']}/itinerary/check")
    assert resp.status_code == 200
    body = resp.json()
    keys = {item["key"] for item in body["items"]}
    assert keys == {"budget", "time", "interest", "route"}
    assert isinstance(body["hasFailingConstraint"], bool)


def test_optimize_itinerary(client, generated_itinerary):
    trip, before = generated_itinerary
    resp = client.post(
        f"/api/trips/{trip['id']}/itinerary/optimize",
        json={"budgetMax": 1500},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["before"]["id"] == before["id"]
    assert body["after"]["totals"]["cost"] <= before["totals"]["cost"] + 1
    assert body["savingsCost"] >= 0
    assert body["savingsTimeHours"] >= 0


def test_activity_alternatives_and_replace(client, generated_itinerary):
    trip, itinerary = generated_itinerary
    first_stop_attraction_id = itinerary["days"][0]["stops"][0]["attraction"]["id"]

    # item ids are DB-internal auto-increment ints starting at 1 for a
    # freshly generated itinerary in an empty test DB.
    item_id = 1

    alt_resp = client.get(f"/api/trips/{trip['id']}/itinerary/items/{item_id}/alternatives")
    assert alt_resp.status_code == 200
    alternatives = alt_resp.json()
    assert isinstance(alternatives, list)
    assert all(a["id"] != first_stop_attraction_id for a in alternatives)

    if alternatives:
        new_attraction_id = alternatives[0]["id"]
        put_resp = client.put(
            f"/api/trips/{trip['id']}/itinerary/items/{item_id}",
            params={"attraction_id": new_attraction_id},
        )
        assert put_resp.status_code == 200
        updated = put_resp.json()
        assert updated["days"][0]["stops"][0]["attraction"]["id"] == new_attraction_id


def test_replace_activity_item_not_found(client, generated_itinerary):
    trip, _ = generated_itinerary
    resp = client.put(
        f"/api/trips/{trip['id']}/itinerary/items/999999",
        params={"attraction_id": "hyd-charminar"},
    )
    assert resp.status_code == 404
