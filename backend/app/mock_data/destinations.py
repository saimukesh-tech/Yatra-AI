"""Ported 1:1 from the frontend's src/data/mockDestinations.ts, including
ids, so a trip's destinationId lines up with the same catalogue on both
sides. Field names are kept in snake_case (destination_id, scene_type,
best_for, avg_daily_budget, ...) to match Python/FastAPI conventions; the
Pydantic schema layer (app/schemas) is what re-exposes them to the frontend
using the camelCase names the TypeScript types expect.
"""

MOCK_DESTINATIONS: list[dict] = [
    {
        "id": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "tagline": "Pearls, palaces and biryani",
        "categories": ["History", "Food", "Culture"],
        "scene_type": "heritage",
        "description": (
            "A city of Nizams and pearls, where centuries-old monuments sit beside a "
            "booming tech skyline and some of the country's best food."
        ),
        "best_for": ["history", "food", "photography", "shopping"],
        "avg_daily_budget": 1800,
        "popular": True,
    },
    {
        "id": "araku-valley",
        "name": "Araku Valley",
        "state": "Andhra Pradesh",
        "tagline": "Nature, culture, coffee",
        "categories": ["Nature", "Culture", "Coffee"],
        "scene_type": "hills",
        "description": (
            "Misty hills, tribal culture and coffee plantations along a scenic train "
            "route through the Eastern Ghats."
        ),
        "best_for": ["nature", "photography", "food"],
        "avg_daily_budget": 2200,
        "popular": True,
    },
    {
        "id": "hampi",
        "name": "Hampi",
        "state": "Karnataka",
        "tagline": "History, heritage, adventure",
        "categories": ["History", "Heritage", "Adventure"],
        "scene_type": "heritage",
        "description": (
            "The boulder-strewn ruins of the Vijayanagara empire, a UNESCO World "
            "Heritage site made for slow wandering and sunset views."
        ),
        "best_for": ["history", "photography", "adventure"],
        "avg_daily_budget": 1600,
        "popular": True,
    },
    {
        "id": "kerala",
        "name": "Kerala",
        "state": "Kerala",
        "tagline": "Backwaters, beaches, serenity",
        "categories": ["Backwaters", "Beaches", "Serenity"],
        "scene_type": "backwaters",
        "description": (
            "Palm-fringed backwaters, houseboats and spice-scented hill towns — "
            "God's Own Country at its calmest."
        ),
        "best_for": ["nature", "food", "photography"],
        "avg_daily_budget": 2800,
        "popular": True,
    },
    {
        "id": "ladakh",
        "name": "Ladakh",
        "state": "Ladakh",
        "tagline": "Mountains, adventure, peace",
        "categories": ["Mountains", "Adventure", "Peace"],
        "scene_type": "mountain",
        "description": (
            "High-altitude desert, turquoise lakes and ancient monasteries beneath "
            "some of the world's highest motorable passes."
        ),
        "best_for": ["adventure", "nature", "photography", "spiritual"],
        "avg_daily_budget": 3500,
        "popular": True,
    },
    {
        "id": "madurai",
        "name": "Madurai",
        "state": "Tamil Nadu",
        "tagline": "Temples, culture, food",
        "categories": ["Temples", "Culture", "Food"],
        "scene_type": "temple",
        "description": (
            "One of India's oldest living cities, built around the towering gopurams "
            "of the Meenakshi Amman Temple."
        ),
        "best_for": ["spiritual", "history", "food"],
        "avg_daily_budget": 1500,
        "popular": True,
    },
    {
        "id": "goa",
        "name": "Goa",
        "state": "Goa",
        "tagline": "Beaches, sunsets, laid-back charm",
        "categories": ["Beaches", "Nightlife", "Food"],
        "scene_type": "beach",
        "description": (
            "Golden beaches, Portuguese-era churches and a laid-back coastal rhythm "
            "that swings from quiet to lively after dark."
        ),
        "best_for": ["nature", "food", "entertainment", "shopping"],
        "avg_daily_budget": 2600,
        "popular": True,
    },
    {
        "id": "ooty",
        "name": "Ooty",
        "state": "Tamil Nadu",
        "tagline": "Tea gardens and cool hills",
        "categories": ["Mountains", "Nature", "Gardens"],
        "scene_type": "hills",
        "description": (
            'The "Queen of the Nilgiris" — rolling tea estates, a toy train and '
            "cool hill-station air."
        ),
        "best_for": ["nature", "photography", "adventure"],
        "avg_daily_budget": 2100,
        "popular": True,
    },
    {
        "id": "bengaluru",
        "name": "Bengaluru",
        "state": "Karnataka",
        "tagline": "Gardens, cafes, nightlife",
        "categories": ["Culture", "Food", "Entertainment"],
        "scene_type": "city",
        "description": (
            "India's garden city — leafy boulevards, craft breweries and a "
            "buzzing food and startup scene."
        ),
        "best_for": ["food", "entertainment", "shopping"],
        "avg_daily_budget": 2400,
        "popular": False,
    },
    {
        "id": "delhi",
        "name": "Delhi",
        "state": "Delhi",
        "tagline": "Monuments, markets, history",
        "categories": ["History", "Heritage", "Food"],
        "scene_type": "heritage",
        "description": (
            "Seven historic cities layered into one — Mughal forts, colonial "
            "boulevards and endless street food."
        ),
        "best_for": ["history", "food", "shopping", "photography"],
        "avg_daily_budget": 2000,
        "popular": False,
    },
    {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "tagline": "Coastline, cinema, energy",
        "categories": ["City", "Culture", "Food"],
        "scene_type": "city",
        "description": (
            "The city that never sleeps — colonial architecture, a dramatic "
            "coastline and the heart of Indian cinema."
        ),
        "best_for": ["entertainment", "food", "shopping", "photography"],
        "avg_daily_budget": 2600,
        "popular": False,
    },
    {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "tagline": "Temples, shore, classical arts",
        "categories": ["Culture", "Beach", "Food"],
        "scene_type": "temple",
        "description": (
            "Temple towns, the world's second-longest urban beach and a deep-rooted "
            "classical arts scene."
        ),
        "best_for": ["spiritual", "food", "nature"],
        "avg_daily_budget": 1700,
        "popular": False,
    },
]


def get_destination_by_id(destination_id: str) -> dict | None:
    return next((d for d in MOCK_DESTINATIONS if d["id"] == destination_id), None)


def get_destination_by_name(name: str) -> dict | None:
    lowered = name.lower()
    return next((d for d in MOCK_DESTINATIONS if d["name"].lower() == lowered), None)
