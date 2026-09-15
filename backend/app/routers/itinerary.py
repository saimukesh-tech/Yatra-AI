"""Itinerary retrieval, per-day retrieval, optimize and constraint-check -
supports the frontend's useItinerary hook / Timeline / ConstraintCheck /
OptimizePanel components (see itineraryService.ts, constraints.ts). Also
includes activity-replacement endpoints (GET alternatives, PUT item) which
the current frontend UI doesn't call yet but were explicitly requested.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.mock_data.attractions import get_attraction_by_id, get_attractions_for
from app.models.itinerary import Itinerary as ItineraryORM
from app.models.itinerary import ItineraryItem as ItineraryItemORM
from app.models.trip import Trip as TripORM
from app.schemas.itinerary import (
    Attraction as AttractionSchema,
)
from app.schemas.itinerary import (
    ConstraintCheckResponse,
    Itinerary as ItinerarySchema,
    ItineraryDay as ItineraryDaySchema,
    OptimizeRequest,
    OptimizeResponse,
)
from app.services import constraint_service, itinerary_service
from app.services.itinerary_persistence import (
    itinerary_orm_to_dict,
    persist_itinerary,
    recompute_totals_and_scores,
)

router = APIRouter(prefix="/trips/{trip_id}/itinerary", tags=["itinerary"])


def _get_trip_or_404(db: Session, trip_id: str) -> TripORM:
    trip = db.query(TripORM).filter(TripORM.id == trip_id).one_or_none()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    return trip


def _get_itinerary_orm_or_404(db: Session, trip_id: str) -> ItineraryORM:
    _get_trip_or_404(db, trip_id)
    itin = db.query(ItineraryORM).filter(ItineraryORM.trip_id == trip_id).one_or_none()
    if itin is None:
        raise HTTPException(
            status_code=404,
            detail=f"No itinerary generated yet for trip '{trip_id}'. POST /api/trips/{trip_id}/generate first.",
        )
    return itin


@router.get("", response_model=ItinerarySchema)
def get_itinerary(trip_id: str, db: Session = Depends(get_db)):
    return itinerary_orm_to_dict(_get_itinerary_orm_or_404(db, trip_id))


@router.get("/day/{day_number}", response_model=ItineraryDaySchema)
def get_itinerary_day(trip_id: str, day_number: int, db: Session = Depends(get_db)):
    itinerary_dict = itinerary_orm_to_dict(_get_itinerary_orm_or_404(db, trip_id))
    for day in itinerary_dict["days"]:
        if day["day_number"] == day_number:
            return day
    raise HTTPException(status_code=404, detail=f"Day {day_number} not found in this itinerary")


@router.post("/optimize", response_model=OptimizeResponse)
def optimize_itinerary(trip_id: str, payload: OptimizeRequest, db: Session = Depends(get_db)):
    trip = _get_trip_or_404(db, trip_id)
    before_orm = _get_itinerary_orm_or_404(db, trip_id)
    before_dict = itinerary_orm_to_dict(before_orm)

    result = itinerary_service.optimize_itinerary(
        before_dict, payload.budget_max, payload.max_hours_per_day
    )
    after_orm = persist_itinerary(db, trip, result["after"])
    after_dict = itinerary_orm_to_dict(after_orm)

    return {
        "before": before_dict,
        "after": after_dict,
        "savings_cost": result["savings"]["cost"],
        "savings_time_hours": result["savings"]["hours"],
    }


@router.post("/check", response_model=ConstraintCheckResponse)
def check_itinerary_constraints(trip_id: str, db: Session = Depends(get_db)):
    itinerary_dict = itinerary_orm_to_dict(_get_itinerary_orm_or_404(db, trip_id))
    checks = constraint_service.build_constraint_checks(itinerary_dict)
    return {"items": checks, "has_failing_constraint": constraint_service.has_failing_constraint(checks)}


@router.get("/items/{item_id}/alternatives", response_model=list[AttractionSchema])
def get_activity_alternatives(trip_id: str, item_id: int, db: Session = Depends(get_db)):
    """Suggests other attractions from the same destination, not already
    used elsewhere in the itinerary, ranked by overlap with the trip's
    interests - the pool an "swap this activity" UI would offer.
    """
    itin_orm = _get_itinerary_orm_or_404(db, trip_id)
    item = db.query(ItineraryItemORM).join(ItineraryItemORM.day).filter(
        ItineraryItemORM.id == item_id
    ).one_or_none()
    if item is None or item.day.itinerary_id != itin_orm.id:
        raise HTTPException(status_code=404, detail=f"Itinerary item '{item_id}' not found for this trip")

    input_snapshot = itin_orm.input_snapshot
    interests = input_snapshot.get("interests", [])
    destination_id = item.attraction_snapshot.get("destination_id", input_snapshot.get("destination_id"))

    used_ids = {
        i.attraction_id
        for d in itin_orm.days
        for i in d.items
    }
    candidates = [a for a in get_attractions_for(destination_id) if a["id"] not in used_ids]
    candidates.sort(
        key=lambda a: len([c for c in a["categories"] if c in interests]),
        reverse=True,
    )
    return candidates


@router.put("/items/{item_id}", response_model=ItinerarySchema)
def replace_activity(trip_id: str, item_id: int, attraction_id: str, db: Session = Depends(get_db)):
    """Swaps the attraction at one itinerary stop for a different one
    (identified by attraction_id, typically taken from the alternatives
    endpoint above), then recomputes totals/scores. Body-less by design -
    attraction_id is a query param since this is a small, single-field
    replacement.
    """
    itin_orm = _get_itinerary_orm_or_404(db, trip_id)
    item = db.query(ItineraryItemORM).join(ItineraryItemORM.day).filter(
        ItineraryItemORM.id == item_id
    ).one_or_none()
    if item is None or item.day.itinerary_id != itin_orm.id:
        raise HTTPException(status_code=404, detail=f"Itinerary item '{item_id}' not found for this trip")

    new_attraction = get_attraction_by_id(attraction_id)
    if new_attraction is None:
        raise HTTPException(status_code=404, detail=f"Attraction '{attraction_id}' not found")

    input_snapshot = itin_orm.input_snapshot
    item.attraction_id = new_attraction["id"]
    item.attraction_snapshot = new_attraction
    item.reason = "Swapped in to replace a previous stop."
    db.commit()

    itinerary_dict = itinerary_orm_to_dict(itin_orm)
    itinerary_dict["input"] = input_snapshot
    recompute_totals_and_scores(itinerary_dict)

    itin_orm.total_cost = itinerary_dict["totals"]["cost"]
    itin_orm.total_time_hours = itinerary_dict["totals"]["time_hours"]
    itin_orm.total_distance_km = itinerary_dict["totals"]["distance_km"]
    itin_orm.total_place_count = itinerary_dict["totals"]["place_count"]
    itin_orm.score_interest_match = itinerary_dict["scores"]["interest_match"]
    itin_orm.score_budget_fit = itinerary_dict["scores"]["budget_fit"]
    itin_orm.score_time_fit = itinerary_dict["scores"]["time_fit"]
    itin_orm.score_route_efficiency = itinerary_dict["scores"]["route_efficiency"]
    db.commit()

    return itinerary_dict
