def test_transport_estimate(client):
    resp = client.get("/api/transport/estimate", params={"group_size": 4})
    assert resp.status_code == 200
    body = resp.json()
    assert body["groupSize"] == 4
    assert body["isEstimate"] is True
    assert body["savingsTotal"] == body["individual"]["totalCost"] - body["shared"]["totalCost"]
    assert body["savingsPerPerson"] == round(body["savingsTotal"] / 4)


def test_transport_estimate_requires_positive_group_size(client):
    resp = client.get("/api/transport/estimate", params={"group_size": 0})
    assert resp.status_code == 422


def test_transport_options(client):
    resp = client.get(
        "/api/transport/options",
        params={"origin": "Hyderabad", "destination": "Goa"},
    )
    assert resp.status_code == 200
    options = resp.json()
    assert len(options) == 3
    modes = {o["mode"] for o in options}
    assert modes == {"Flight", "Train", "Bus"}
    assert all(o["origin"] == "Hyderabad" and o["destination"] == "Goa" for o in options)


def test_transport_options_requires_origin_and_destination(client):
    resp = client.get("/api/transport/options", params={"origin": "Hyderabad"})
    assert resp.status_code == 422
