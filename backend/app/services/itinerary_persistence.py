"""Bridges the pure itinerary_service dict-in/dict-out functions to the
SQLAlchemy models in app/models/itinerary.py: persisting a generated
itinerary dict to the DB, and re-hydrating a DB row back into the same dict
shape the schemas/services expect.
"""

from sqlalchemy.orm import Session

from app.models.itinerary import Itinerary as ItineraryORM
from app.models.itinerary import ItineraryDay as ItineraryDayORM
from app.models.itinerary import ItineraryItem as ItineraryItemORM
from app.models.trip import Trip as TripORM


def trip_to_input_dict(trip: TripORM) -> dict:
    return {
        "destination_id": trip.destination_id,
        "destination_name": trip.destination_name,
        "budget_min": trip.budget_min,
        "budget_max": trip.budget_max,
        "duration_days": trip.duration_days,
        "duration_nights": trip.duration_nights,
        "interests": list(trip.interests or []),
        "constraints": trip.constraints or "",
        "travelers": trip.travelers,
        "start_date": trip.start_date,
    }


def persist_itinerary(db: Session, trip: TripORM, itinerary_dict: dict) -> ItineraryORM:
    """Replaces any existing itinerary for this trip with the given one
    (generate/optimize always produce a fresh full itinerary)."""

    existing = db.query(ItineraryORM).filter(ItineraryORM.trip_id == trip.id).one_or_none()
    if existing is not None:
        db.delete(existing)
        db.flush()

    totals = itinerary_dict["totals"]
    scores = itinerary_dict["scores"]

    itin = ItineraryORM(
        id=itinerary_dict["id"],
        trip_id=trip.id,
        input_snapshot=itinerary_dict["input"],
        total_cost=totals["cost"],
        total_time_hours=totals["time_hours"],
        total_distance_km=totals["distance_km"],
        total_place_count=totals["place_count"],
        score_interest_match=scores["interest_match"],
        score_budget_fit=scores["budget_fit"],
        score_time_fit=scores["time_fit"],
        score_route_efficiency=scores["route_efficiency"],
        generated_at=itinerary_dict["generated_at"],
    )
    db.add(itin)
    db.flush()

    for day in itinerary_dict["days"]:
        day_orm = ItineraryDayORM(
            itinerary_id=itin.id,
            day_number=day["day_number"],
            label=day["label"],
            summary=day["summary"],
        )
        db.add(day_orm)
        db.flush()

        for idx, stop in enumerate(day["stops"]):
            attraction = stop["attraction"]
            item_orm = ItineraryItemORM(
                day_id=day_orm.id,
                order_index=idx,
                attraction_id=attraction["id"],
                attraction_snapshot=attraction,
                time=stop["time"],
                reason=stop["reason"],
            )
            db.add(item_orm)

    db.commit()
    db.refresh(itin)
    return itin


def itinerary_orm_to_dict(itin: ItineraryORM) -> dict:
    days = []
    for day in sorted(itin.days, key=lambda d: d.day_number):
        stops = [
            {"attraction": item.attraction_snapshot, "time": item.time, "reason": item.reason}
            for item in sorted(day.items, key=lambda i: i.order_index)
        ]
        days.append({"day_number": day.day_number, "label": day.label, "summary": day.summary, "stops": stops})

    return {
        "id": itin.id,
        "input": itin.input_snapshot,
        "days": days,
        "totals": {
            "cost": itin.total_cost,
            "time_hours": itin.total_time_hours,
            "distance_km": itin.total_distance_km,
            "place_count": itin.total_place_count,
        },
        "scores": {
            "interest_match": itin.score_interest_match,
            "budget_fit": itin.score_budget_fit,
            "time_fit": itin.score_time_fit,
            "route_efficiency": itin.score_route_efficiency,
        },
        "generated_at": itin.generated_at,
    }


def recompute_totals_and_scores(itinerary_dict: dict) -> dict:
    """Recomputes totals/scores from itinerary_dict['days'] in place - used
    after an activity-replacement PUT swaps one stop's attraction, so the
    displayed cost/time/match numbers stay consistent without a full
    re-generate.
    """
    trip_input = itinerary_dict["input"]
    all_stops = [s for d in itinerary_dict["days"] for s in d["stops"]]

    total_cost = sum(s["attraction"]["cost"] for s in all_stops)
    total_touring_minutes = sum(s["attraction"]["duration_minutes"] for s in all_stops)
    total_distance = sum(s["attraction"]["distance_km_to_next"] for s in all_stops)
    place_count = len(all_stops)

    interests = trip_input["interests"]
    matched_stops = [s for s in all_stops if any(c in interests for c in s["attraction"]["categories"])]
    if not interests:
        interest_match = 72
    else:
        ratio = len(matched_stops) / max(1, len(all_stops))
        interest_match = min(98, round(ratio * 100 * 0.9 + 15))

    avg_distance = (total_distance / len(all_stops)) if all_stops else 0
    route_efficiency = max(45, min(98, round(100 - avg_distance * 3.2)))

    budget_max = trip_input["budget_max"]
    budget_fit = max(0, min(100, round(100 - ((total_cost - budget_max) / budget_max) * 100))) if budget_max else 0

    available_hours = trip_input["duration_days"] * 7
    time_hours = round(total_touring_minutes / 60 * 10) / 10
    time_fit = (
        max(0, min(100, round(100 - ((time_hours - available_hours) / available_hours) * 100)))
        if available_hours
        else 0
    )

    itinerary_dict["totals"] = {
        "cost": total_cost,
        "time_hours": time_hours,
        "distance_km": round(total_distance),
        "place_count": place_count,
    }
    itinerary_dict["scores"] = {
        "interest_match": interest_match,
        "budget_fit": budget_fit,
        "time_fit": time_fit,
        "route_efficiency": route_efficiency,
    }
    return itinerary_dict
