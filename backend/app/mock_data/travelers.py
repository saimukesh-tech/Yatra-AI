"""Ported 1:1 from the frontend's src/data/mockTravelers.ts. Used by the
Group Match feature as the pool of "other travelers" to score against the
current trip's inputs.
"""

MOCK_TRAVELERS: list[dict] = [
    # ---------------- Hyderabad ----------------
    {"id": "trv-hyd-1", "label": "Traveler A", "destination_id": "hyderabad", "interests": ["history", "food"], "start_time": "09:00", "end_time": "18:00", "budget": 2500, "duration_days": 2},
    {"id": "trv-hyd-2", "label": "Traveler B", "destination_id": "hyderabad", "interests": ["history", "photography"], "start_time": "10:00", "end_time": "18:00", "budget": 3000, "duration_days": 2},
    {"id": "trv-hyd-3", "label": "Traveler C", "destination_id": "hyderabad", "interests": ["food", "shopping"], "start_time": "09:00", "end_time": "17:00", "budget": 2000, "duration_days": 2},
    {"id": "trv-hyd-4", "label": "Traveler D", "destination_id": "hyderabad", "interests": ["photography", "entertainment"], "start_time": "11:00", "end_time": "20:00", "budget": 3500, "duration_days": 3},
    {"id": "trv-hyd-5", "label": "Traveler E", "destination_id": "hyderabad", "interests": ["adventure", "entertainment"], "start_time": "08:00", "end_time": "16:00", "budget": 1500, "duration_days": 1},

    # ---------------- Araku Valley ----------------
    {"id": "trv-ark-1", "label": "Traveler A", "destination_id": "araku-valley", "interests": ["nature", "photography"], "start_time": "07:00", "end_time": "18:00", "budget": 3200, "duration_days": 3},
    {"id": "trv-ark-2", "label": "Traveler B", "destination_id": "araku-valley", "interests": ["nature", "food"], "start_time": "08:00", "end_time": "17:00", "budget": 2800, "duration_days": 2},
    {"id": "trv-ark-3", "label": "Traveler C", "destination_id": "araku-valley", "interests": ["adventure", "nature"], "start_time": "07:30", "end_time": "19:00", "budget": 3000, "duration_days": 3},
    {"id": "trv-ark-4", "label": "Traveler D", "destination_id": "araku-valley", "interests": ["shopping", "food"], "start_time": "10:00", "end_time": "16:00", "budget": 1800, "duration_days": 2},

    # ---------------- Hampi ----------------
    {"id": "trv-ham-1", "label": "Traveler A", "destination_id": "hampi", "interests": ["history", "photography"], "start_time": "06:00", "end_time": "18:00", "budget": 2200, "duration_days": 2},
    {"id": "trv-ham-2", "label": "Traveler B", "destination_id": "hampi", "interests": ["history", "adventure"], "start_time": "07:00", "end_time": "17:00", "budget": 1900, "duration_days": 2},
    {"id": "trv-ham-3", "label": "Traveler C", "destination_id": "hampi", "interests": ["adventure", "nature"], "start_time": "06:30", "end_time": "19:00", "budget": 2500, "duration_days": 3},
    {"id": "trv-ham-4", "label": "Traveler D", "destination_id": "hampi", "interests": ["food", "photography"], "start_time": "09:00", "end_time": "17:00", "budget": 1700, "duration_days": 1},

    # ---------------- Kerala ----------------
    {"id": "trv-ker-1", "label": "Traveler A", "destination_id": "kerala", "interests": ["nature", "food"], "start_time": "08:00", "end_time": "20:00", "budget": 5500, "duration_days": 4},
    {"id": "trv-ker-2", "label": "Traveler B", "destination_id": "kerala", "interests": ["nature", "photography"], "start_time": "09:00", "end_time": "19:00", "budget": 6000, "duration_days": 4},
    {"id": "trv-ker-3", "label": "Traveler C", "destination_id": "kerala", "interests": ["food", "entertainment"], "start_time": "10:00", "end_time": "20:00", "budget": 4800, "duration_days": 3},
    {"id": "trv-ker-4", "label": "Traveler D", "destination_id": "kerala", "interests": ["adventure", "nature"], "start_time": "07:00", "end_time": "18:00", "budget": 5200, "duration_days": 3},

    # ---------------- Ladakh ----------------
    {"id": "trv-lad-1", "label": "Traveler A", "destination_id": "ladakh", "interests": ["adventure", "nature"], "start_time": "06:00", "end_time": "19:00", "budget": 8000, "duration_days": 5},
    {"id": "trv-lad-2", "label": "Traveler B", "destination_id": "ladakh", "interests": ["adventure", "photography"], "start_time": "06:30", "end_time": "18:30", "budget": 7500, "duration_days": 5},
    {"id": "trv-lad-3", "label": "Traveler C", "destination_id": "ladakh", "interests": ["spiritual", "nature"], "start_time": "07:00", "end_time": "17:00", "budget": 6800, "duration_days": 4},
    {"id": "trv-lad-4", "label": "Traveler D", "destination_id": "ladakh", "interests": ["photography", "shopping"], "start_time": "09:00", "end_time": "18:00", "budget": 7000, "duration_days": 4},

    # ---------------- Madurai ----------------
    {"id": "trv-mdu-1", "label": "Traveler A", "destination_id": "madurai", "interests": ["spiritual", "history"], "start_time": "06:00", "end_time": "16:00", "budget": 1600, "duration_days": 2},
    {"id": "trv-mdu-2", "label": "Traveler B", "destination_id": "madurai", "interests": ["spiritual", "food"], "start_time": "07:00", "end_time": "17:00", "budget": 1400, "duration_days": 1},
    {"id": "trv-mdu-3", "label": "Traveler C", "destination_id": "madurai", "interests": ["history", "food"], "start_time": "08:00", "end_time": "18:00", "budget": 1800, "duration_days": 2},
    {"id": "trv-mdu-4", "label": "Traveler D", "destination_id": "madurai", "interests": ["shopping", "food"], "start_time": "09:00", "end_time": "17:00", "budget": 1500, "duration_days": 1},

    # ---------------- Goa ----------------
    {"id": "trv-goa-1", "label": "Traveler A", "destination_id": "goa", "interests": ["nature", "entertainment"], "start_time": "10:00", "end_time": "23:00", "budget": 3500, "duration_days": 3},
    {"id": "trv-goa-2", "label": "Traveler B", "destination_id": "goa", "interests": ["food", "entertainment"], "start_time": "11:00", "end_time": "23:59", "budget": 4000, "duration_days": 3},
    {"id": "trv-goa-3", "label": "Traveler C", "destination_id": "goa", "interests": ["history", "photography"], "start_time": "08:00", "end_time": "17:00", "budget": 2800, "duration_days": 2},
    {"id": "trv-goa-4", "label": "Traveler D", "destination_id": "goa", "interests": ["shopping", "food"], "start_time": "10:00", "end_time": "20:00", "budget": 3200, "duration_days": 2},

    # ---------------- Ooty ----------------
    {"id": "trv-oot-1", "label": "Traveler A", "destination_id": "ooty", "interests": ["nature", "photography"], "start_time": "08:00", "end_time": "18:00", "budget": 2400, "duration_days": 2},
    {"id": "trv-oot-2", "label": "Traveler B", "destination_id": "ooty", "interests": ["nature", "adventure"], "start_time": "07:00", "end_time": "17:00", "budget": 2200, "duration_days": 2},
    {"id": "trv-oot-3", "label": "Traveler C", "destination_id": "ooty", "interests": ["shopping", "food"], "start_time": "09:00", "end_time": "19:00", "budget": 2000, "duration_days": 1},
    {"id": "trv-oot-4", "label": "Traveler D", "destination_id": "ooty", "interests": ["photography", "adventure"], "start_time": "08:00", "end_time": "18:00", "budget": 2600, "duration_days": 2},

    # ---------------- Bengaluru ----------------
    {"id": "trv-blr-1", "label": "Traveler A", "destination_id": "bengaluru", "interests": ["food", "entertainment"], "start_time": "10:00", "end_time": "22:00", "budget": 3200, "duration_days": 2},
    {"id": "trv-blr-2", "label": "Traveler B", "destination_id": "bengaluru", "interests": ["shopping", "food"], "start_time": "11:00", "end_time": "20:00", "budget": 3000, "duration_days": 2},
    {"id": "trv-blr-3", "label": "Traveler C", "destination_id": "bengaluru", "interests": ["nature", "photography"], "start_time": "08:00", "end_time": "17:00", "budget": 2400, "duration_days": 1},
    {"id": "trv-blr-4", "label": "Traveler D", "destination_id": "bengaluru", "interests": ["entertainment", "shopping"], "start_time": "12:00", "end_time": "23:00", "budget": 3500, "duration_days": 2},

    # ---------------- Delhi ----------------
    {"id": "trv-del-1", "label": "Traveler A", "destination_id": "delhi", "interests": ["history", "photography"], "start_time": "08:00", "end_time": "18:00", "budget": 2800, "duration_days": 3},
    {"id": "trv-del-2", "label": "Traveler B", "destination_id": "delhi", "interests": ["food", "shopping"], "start_time": "09:00", "end_time": "19:00", "budget": 2600, "duration_days": 2},
    {"id": "trv-del-3", "label": "Traveler C", "destination_id": "delhi", "interests": ["history", "food"], "start_time": "08:30", "end_time": "18:30", "budget": 3000, "duration_days": 3},
    {"id": "trv-del-4", "label": "Traveler D", "destination_id": "delhi", "interests": ["shopping", "entertainment"], "start_time": "11:00", "end_time": "20:00", "budget": 3200, "duration_days": 2},

    # ---------------- Mumbai ----------------
    {"id": "trv-mum-1", "label": "Traveler A", "destination_id": "mumbai", "interests": ["entertainment", "food"], "start_time": "10:00", "end_time": "23:00", "budget": 4000, "duration_days": 2},
    {"id": "trv-mum-2", "label": "Traveler B", "destination_id": "mumbai", "interests": ["history", "photography"], "start_time": "08:00", "end_time": "18:00", "budget": 3200, "duration_days": 2},
    {"id": "trv-mum-3", "label": "Traveler C", "destination_id": "mumbai", "interests": ["shopping", "food"], "start_time": "11:00", "end_time": "21:00", "budget": 3800, "duration_days": 2},
    {"id": "trv-mum-4", "label": "Traveler D", "destination_id": "mumbai", "interests": ["photography", "entertainment"], "start_time": "09:00", "end_time": "20:00", "budget": 4200, "duration_days": 3},

    # ---------------- Chennai ----------------
    {"id": "trv-che-1", "label": "Traveler A", "destination_id": "chennai", "interests": ["spiritual", "food"], "start_time": "07:00", "end_time": "17:00", "budget": 1900, "duration_days": 2},
    {"id": "trv-che-2", "label": "Traveler B", "destination_id": "chennai", "interests": ["nature", "food"], "start_time": "08:00", "end_time": "18:00", "budget": 2100, "duration_days": 2},
    {"id": "trv-che-3", "label": "Traveler C", "destination_id": "chennai", "interests": ["history", "spiritual"], "start_time": "07:30", "end_time": "17:30", "budget": 1800, "duration_days": 1},
    {"id": "trv-che-4", "label": "Traveler D", "destination_id": "chennai", "interests": ["food", "shopping"], "start_time": "10:00", "end_time": "19:00", "budget": 2000, "duration_days": 2},
]


def get_travelers_for(destination_id: str) -> list[dict]:
    return [t for t in MOCK_TRAVELERS if t["destination_id"] == destination_id]
