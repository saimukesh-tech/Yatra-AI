"""Mock transport data.

Two unrelated things live here, matching two different frontend needs:

1. SHARED_TRANSPORT_TIERS: powers /api/transport/estimate, the endpoint the
   frontend's transportService.ts actually needs (local shared transport for
   a matched travel group: individual rides vs. one shared vehicle).
   Ported 1:1 from src/services/transportService.ts.

2. MOCK_INTERCITY_OPTIONS: powers /api/transport/options, the
   origin/destination/date search endpoint requested in the backend spec.
   Nothing in the current frontend consumes this shape yet (there is no
   "search flights/trains/buses between two cities" feature in the UI) -
   it's included because it was explicitly requested, generated per
   origin/destination pair rather than hard-coded per city so any
   origin/destination string works.
"""

PER_PERSON_INDIVIDUAL_COST = 1000  # avg local transport spend/person across the trip
SHARED_SAVINGS_RATIO = 0.6  # shared travel costs ~60% of the individual total


def vehicle_for(group_size: int) -> dict:
    if group_size <= 4:
        return {"vehicle": "Shared Cab", "capacity": 4}
    if group_size <= 8:
        return {"vehicle": "Mini-Bus", "capacity": 8}
    return {"vehicle": "Tempo Traveller", "capacity": 12}


def intercity_options(origin: str, destination: str) -> list[dict]:
    """Deterministic mock flight/train/bus options for a given city pair."""
    seed = (len(origin) + len(destination)) % 5
    return [
        {
            "mode": "Flight",
            "provider": "IndiGo",
            "price": 4200 + seed * 150,
            "duration": "2h 30m",
            "origin": origin,
            "destination": destination,
        },
        {
            "mode": "Train",
            "provider": "Indian Railways (AC 3-Tier)",
            "price": 1600 + seed * 60,
            "duration": "12h 00m",
            "origin": origin,
            "destination": destination,
        },
        {
            "mode": "Bus",
            "provider": "Volvo AC Sleeper",
            "price": 1100 + seed * 40,
            "duration": "14h 00m",
            "origin": origin,
            "destination": destination,
        },
    ]
