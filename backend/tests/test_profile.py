def test_get_profile_default(client):
    resp = client.get("/api/profile")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Demo Traveler"
    assert body["email"] == "demo@yatraai.app"


def test_update_profile(client):
    resp = client.put("/api/profile", json={"name": "Saiteja", "homeCity": "Hyderabad"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Saiteja"
    assert body["homeCity"] == "Hyderabad"

    # persisted
    resp2 = client.get("/api/profile")
    assert resp2.json()["name"] == "Saiteja"
