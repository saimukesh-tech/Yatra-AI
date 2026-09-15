"""Faithful Python port of src/services/itineraryService.ts.

Kept algorithmically identical (same constants, same scoring formulas, same
greedy day-packing loop) so a generated itinerary from this backend matches
what the frontend's own mock generator would have produced for the same
input. Operates on plain dicts (snake_case, matching app/mock_data/*.py and
the schemas in app/schemas/itinerary.py, which accept snake_case via
populate_by_name) rather than ORM/Pydantic objects, so it's easy to unit
test and easy to later swap for a LangGraph pipeline that returns the same
shape.
"""

from datetime import datetime, timezone
from typing import Optional

from app.mock_data.attractions import get_attractions_for
from app.mock_data.destinations import (
    MOCK_DESTINATIONS,
    get_destination_by_id,
    get_destination_by_name,
)
from app.utils.ids import generate_id

DAY_MINUTES_BUDGET = 7 * 60  # ~7 touring hours/day, matches constraints.ts
DAY_START_MINUTES = 9 * 60  # 9:00 AM


def _format_minutes_label(total_minutes: int) -> str:
    hh = (total_minutes % (24 * 60)) // 60
    mm = total_minutes % 60
    period = "PM" if hh >= 12 else "AM"
    hour12 = 12 if hh % 12 == 0 else hh % 12
    return f"{hour12}:{mm:02d} {period}"


def _reason_for(attraction: dict, interests: list[str]) -> str:
    overlap = [c for c in attraction["categories"] if c in interests]
    if overlap:
        label = " and ".join(c[0].upper() + c[1:] for c in overlap)
        return f"Strong match for your interest in {label}."
    return "A well-rated way to experience the destination."


def _relevance_score(attraction: dict, interests: list[str]) -> float:
    if not interests:
        return 50
    overlap = len([c for c in attraction["categories"] if c in interests])
    return (overlap / len(attraction["categories"])) * 100 + overlap * 15


def _generic_attractions_for(destination_name: str, interests: list[str]) -> list[dict]:
    """Fallback used when a freeform / unrecognised destination is given."""
    pool = interests if interests else ["history", "food", "nature", "photography"]
    result = []
    for i, interest in enumerate(pool[:6]):
        result.append(
            {
                "id": f"generic-{destination_name}-{i}",
                "destination_id": "generic",
                "name": f"{interest[0].upper() + interest[1:]} Highlights of {destination_name}",
                "categories": [interest],
                "description": f"A curated local experience centered on {interest} in {destination_name}.",
                "duration_minutes": 90,
                "cost": 250 + i * 50,
                "scene_type": "city",
                "travel_minutes_to_next": 20,
                "distance_km_to_next": 6,
                "best_slot": "morning" if i % 3 == 0 else ("afternoon" if i % 3 == 1 else "evening"),
            }
        )
    return result


def build_itinerary(trip_input: dict, overrides: Optional[dict] = None) -> dict:
    """overrides: {"budget_max": int, "max_hours": float} - used by optimize."""

    overrides = overrides or {}
    destination = get_destination_by_id(trip_input["destination_id"]) or get_destination_by_name(
        trip_input.get("destination_name", "")
    )
    destination_name = (destination or {}).get("name") or trip_input.get("destination_name") or "Your Destination"
    raw_attractions = get_attractions_for(destination["id"]) if destination else []
    pool = raw_attractions if raw_attractions else _generic_attractions_for(destination_name, trip_input["interests"])

    budget_max = overrides.get("budget_max") if overrides.get("budget_max") is not None else trip_input["budget_max"]
    if overrides.get("max_hours") is not None:
        total_minutes_budget = overrides["max_hours"] * 60
    else:
        total_minutes_budget = trip_input["duration_days"] * DAY_MINUTES_BUDGET

    interests = trip_input["interests"]
    scored = sorted(
        [{"attraction": a, "score": _relevance_score(a, interests)} for a in pool],
        key=lambda s: (-s["score"], s["attraction"]["cost"]),
    )

    days = [
        {"day_number": i + 1, "label": f"Day {i + 1}", "summary": "", "stops": []}
        for i in range(trip_input["duration_days"])
    ]

    running_cost = 0
    day_index = 0
    per_day_minutes_cap = total_minutes_budget / trip_input["duration_days"]
    day_cursors = [DAY_START_MINUTES] * len(days)

    for entry in scored:
        attraction = entry["attraction"]
        cursor_idx = day_index % len(days)
        day = days[cursor_idx]
        day_used_minutes = sum(
            s["attraction"]["duration_minutes"] + s["attraction"]["travel_minutes_to_next"] for s in day["stops"]
        )
        stop_minutes = attraction["duration_minutes"] + attraction["travel_minutes_to_next"]

        within_day_time = day_used_minutes + stop_minutes <= per_day_minutes_cap
        within_overall_budget = running_cost + attraction["cost"] <= budget_max * 1.02
        below_min_floor = len(day["stops"]) < 3  # keep every day feeling full even if slightly over budget

        if within_day_time and (within_overall_budget or below_min_floor):
            start_time = _format_minutes_label(day_cursors[cursor_idx])
            day["stops"].append(
                {
                    "attraction": attraction,
                    "time": start_time,
                    "reason": _reason_for(attraction, interests),
                }
            )
            day_cursors[cursor_idx] += stop_minutes
            running_cost += attraction["cost"]
            day_index += 1

    for day in days:
        cats: list[str] = []
        for stop in day["stops"]:
            for c in stop["attraction"]["categories"]:
                if c not in cats:
                    cats.append(c)
        day["summary"] = (
            ", ".join(c[0].upper() + c[1:] for c in cats[:3]) if cats else "Free exploration"
        )

    all_stops = [s for d in days for s in d["stops"]]
    total_cost = sum(s["attraction"]["cost"] for s in all_stops)
    total_touring_minutes = sum(s["attraction"]["duration_minutes"] for s in all_stops)
    total_distance = sum(s["attraction"]["distance_km_to_next"] for s in all_stops)
    place_count = len(all_stops)

    totals = {
        "cost": total_cost,
        "time_hours": round(total_touring_minutes / 60 * 10) / 10,
        "distance_km": round(total_distance),
        "place_count": place_count,
    }

    matched_stops = [s for s in all_stops if any(c in interests for c in s["attraction"]["categories"])]
    if not interests:
        interest_match = 72
    else:
        ratio = len(matched_stops) / max(1, len(all_stops))
        interest_match = min(98, round(ratio * 100 * 0.9 + 15))

    avg_distance = (total_distance / len(all_stops)) if all_stops else 0
    route_efficiency = max(45, min(98, round(100 - avg_distance * 3.2)))

    budget_fit = max(0, min(100, round(100 - ((total_cost - budget_max) / budget_max) * 100))) if budget_max else 0
    available_hours = total_minutes_budget / 60
    time_fit = (
        max(0, min(100, round(100 - ((totals["time_hours"] - available_hours) / available_hours) * 100)))
        if available_hours
        else 0
    )

    scores = {
        "interest_match": interest_match,
        "budget_fit": budget_fit,
        "time_fit": time_fit,
        "route_efficiency": route_efficiency,
    }

    resolved_input = {**trip_input, "destination_name": destination_name}

    return {
        "id": generate_id("itin"),
        "input": resolved_input,
        "days": days,
        "totals": totals,
        "scores": scores,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def generate_itinerary(trip_input: dict) -> dict:
    return build_itinerary(trip_input)


def optimize_itinerary(before: dict, new_budget_max: Optional[int], new_available_hours: Optional[float]) -> dict:
    overrides = {}
    if new_budget_max is not None:
        overrides["budget_max"] = new_budget_max
    if new_available_hours is not None:
        overrides["max_hours"] = new_available_hours
    after = build_itinerary(before["input"], overrides)
    return {
        "before": before,
        "after": after,
        "savings": {
            "cost": max(0, before["totals"]["cost"] - after["totals"]["cost"]),
            "hours": max(0, before["totals"]["time_hours"] - after["totals"]["time_hours"]),
            "distance_km": max(0, before["totals"]["distance_km"] - after["totals"]["distance_km"]),
            "places": max(0, before["totals"]["place_count"] - after["totals"]["place_count"]),
        },
    }


def popular_destination_suggestions() -> list[dict]:
    return [d for d in MOCK_DESTINATIONS if d.get("popular")]
