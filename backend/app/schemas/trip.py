"""Mirrors src/types/trip.ts exactly (InterestKey, SceneType, Destination,
TripInput, DEFAULT_TRIP_INPUT) plus the DB-backed Trip record shapes needed
for the CRUD endpoints the frontend doesn't have a TS type for yet (a Trip
is a persisted TripInput with an id + timestamps).
"""

from typing import Literal, Optional

from pydantic import Field

from app.schemas.base import CamelModel

InterestKey = Literal[
    "history",
    "food",
    "nature",
    "adventure",
    "shopping",
    "photography",
    "spiritual",
    "entertainment",
]

SceneType = Literal[
    "mountain",
    "beach",
    "heritage",
    "backwaters",
    "desert",
    "hills",
    "temple",
    "city",
    "wildlife",
]


class Destination(CamelModel):
    id: str
    name: str
    state: str
    tagline: str
    categories: list[str]
    scene_type: SceneType
    description: str
    best_for: list[InterestKey]
    avg_daily_budget: int
    popular: Optional[bool] = None


class TripInput(CamelModel):
    """Exactly src/types/trip.ts TripInput."""

    destination_id: str
    destination_name: str
    budget_min: int
    budget_max: int
    duration_days: int
    duration_nights: int
    interests: list[InterestKey] = Field(default_factory=list)
    constraints: str = ""
    travelers: int
    start_date: Optional[str] = None


class TripCreate(TripInput):
    """POST /api/trips body - identical shape to TripInput."""


class TripUpdate(CamelModel):
    """PUT /api/trips/{id} body - every field optional (partial update)."""

    destination_id: Optional[str] = None
    destination_name: Optional[str] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    interests: Optional[list[InterestKey]] = None
    constraints: Optional[str] = None
    travelers: Optional[int] = None
    start_date: Optional[str] = None


class TripOut(TripInput):
    """A persisted trip: TripInput fields + id/timestamps. This is what the
    Trip CRUD endpoints return; there's no frontend TS type for it yet since
    the frontend currently keeps trips only as SavedTrip (itinerary-based) in
    localStorage, but this is the natural DB-backed shape those endpoints
    imply.
    """

    id: str
    created_at: str
    updated_at: str
    has_itinerary: bool = False
