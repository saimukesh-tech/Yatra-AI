"""Destinations catalogue - uses the frontend's actual 12 destinations
(app/mock_data/destinations.py, ported 1:1 from src/data/mockDestinations.ts)
rather than the illustrative city list in the original spec (Jaipur, Manali,
Udaipur, Varanasi, Mysore aren't in the frontend's data at all).
"""

from fastapi import APIRouter, HTTPException, Query

from app.mock_data.attractions import get_attractions_for
from app.mock_data.destinations import MOCK_DESTINATIONS, get_destination_by_id
from app.schemas.itinerary import Attraction as AttractionSchema
from app.schemas.trip import Destination

router = APIRouter(prefix="/destinations", tags=["destinations"])


@router.get("", response_model=list[Destination])
def list_destinations(popular: bool | None = Query(default=None)):
    if popular is None:
        return MOCK_DESTINATIONS
    return [d for d in MOCK_DESTINATIONS if bool(d.get("popular")) == popular]


@router.get("/{destination_id}", response_model=Destination)
def get_destination(destination_id: str):
    destination = get_destination_by_id(destination_id)
    if destination is None:
        raise HTTPException(status_code=404, detail=f"Destination '{destination_id}' not found")
    return destination


@router.get("/{destination_id}/attractions", response_model=list[AttractionSchema])
def get_destination_attractions(destination_id: str):
    if get_destination_by_id(destination_id) is None:
        raise HTTPException(status_code=404, detail=f"Destination '{destination_id}' not found")
    return get_attractions_for(destination_id)
