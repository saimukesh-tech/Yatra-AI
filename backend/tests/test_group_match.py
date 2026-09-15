def test_group_match_returns_compatible_groups(client):
    resp = client.get(
        "/api/group-match",
        params={
            "destination_id": "hyderabad",
            "budget_min": 1500,
            "budget_max": 3500,
            "interests": ["history", "food", "photography"],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["candidatesConsidered"] == 5  # size of the Hyderabad traveler pool
    assert len(body["groups"]) >= 1
    group = body["groups"][0]
    assert group["label"] == "Travel Group A"
    assert 0 <= group["compatibility"]["overall"] <= 100
    assert group["travelerCount"] == len(group["travelers"])


def test_group_match_missing_required_params_422(client):
    resp = client.get("/api/group-match", params={"destination_id": "hyderabad"})
    assert resp.status_code == 422


def test_group_match_unknown_destination_returns_no_groups(client):
    resp = client.get(
        "/api/group-match",
        params={
            "destination_id": "nowhere",
            "budget_min": 1000,
            "budget_max": 2000,
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["groups"] == []
    assert body["candidatesConsidered"] == 0
