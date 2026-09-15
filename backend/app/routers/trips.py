"""Trip CRUD + itinerary generation. Saved trips ARE trips (per spec #14) -
there's no separate "saved trip" system; a trip persisted here is what the
frontend would eventually call a saved trip once it's wired to real HTTP.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.trip import Trip as TripORM
from app.schemas.itinerary import Itinerary as ItinerarySchema
from app.schemas.trip import TripCreate, TripOut, TripUpdate
from app.services import itinerary_service
from app.services.itinerary_persistence import itinerary_orm_to_dict, persist_itinerary, trip_to_input_dict

router = APIRouter(prefix="/trips", tags=["trips"])


def _trip_to_out(trip: TripORM) -> TripOut:
    return TripOut(
        id=trip.id,
        destination_id=trip.destination_id,
        destination_name=trip.destination_name,
        budget_min=trip.budget_min,
        budget_max=trip.budget_max,
        duration_days=trip.duration_days,
        duration_nights=trip.duration_nights,
        interests=trip.interests or [],
        constraints=trip.constraints or "",
        travelers=trip.travelers,
        start_date=trip.start_date,
        created_at=trip.created_at,
        updated_at=trip.updated_at,
        has_itinerary=trip.itinerary is not None,
    )


def _get_trip_or_404(db: Session, trip_id: str) -> TripORM:
    trip = db.query(TripORM).filter(TripORM.id == trip_id).one_or_none()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    return trip


@router.post("", response_model=TripOut, status_code=201)
def create_trip(payload: TripCreate, db: Session = Depends(get_db)):
    trip = TripORM(
        destination_id=payload.destination_id,
        destination_name=payload.destination_name,
        budget_min=payload.budget_min,
        budget_max=payload.budget_max,
        duration_days=payload.duration_days,
        duration_nights=payload.duration_nights,
        interests=payload.interests,
        constraints=payload.constraints,
        travelers=payload.travelers,
        start_date=payload.start_date,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return _trip_to_out(trip)


@router.get("", response_model=list[TripOut])
def list_trips(db: Session = Depends(get_db)):
    trips = db.query(TripORM).order_by(TripORM.created_at.desc()).all()
    return [_trip_to_out(t) for t in trips]


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    return _trip_to_out(_get_trip_or_404(db, trip_id))


@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: str, payload: TripUpdate, db: Session = Depends(get_db)):
    trip = _get_trip_or_404(db, trip_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(trip, field, value)
    trip.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(trip)
    return _trip_to_out(trip)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = _get_trip_or_404(db, trip_id)
    db.delete(trip)
    db.commit()
    return None


@router.post("/{trip_id}/generate", response_model=ItinerarySchema)
def generate_trip_itinerary(trip_id: str, db: Session = Depends(get_db)):
    """Generates a mock (no-AI, rule-based) itinerary for the trip and
    persists it, replacing any previously generated one. This is the seam a
    future LangGraph multi-agent pipeline would replace: same input shape in
    (TripInput dict), same Itinerary shape out - see itinerary_service.py's
    module docstring.
    """
    trip = _get_trip_or_404(db, trip_id)
    trip_input = trip_to_input_dict(trip)
    itinerary_dict = itinerary_service.generate_itinerary(trip_input)
    itin_orm = persist_itinerary(db, trip, itinerary_dict)
    return itinerary_orm_to_dict(itin_orm)
