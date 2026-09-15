"""Mirrors src/types/itinerary.ts exactly: Attraction, ItineraryStop,
ItineraryDay, ItineraryScores, ItineraryTotals, Itinerary, ConstraintStatus,
ConstraintCheckItem, SavedTrip.
"""

from typing import Literal, Optional

from app.schemas.base import CamelModel
from app.schemas.trip import InterestKey, SceneType, TripInput


class Attraction(CamelModel):
    id: str
    destination_id: str
    name: str
    categories: list[InterestKey]
    description: str
    duration_minutes: int
    cost: int
    scene_type: SceneType
    travel_minutes_to_next: int
    distance_km_to_next: float
    best_slot: Literal["morning", "afternoon", "evening"]


class ItineraryStop(CamelModel):
    attraction: Attraction
    time: str  # "09:00 AM"
    reason: str


class ItineraryDay(CamelModel):
    day_number: int
    label: str
    summary: str
    stops: list[ItineraryStop]


class ItineraryScores(CamelModel):
    interest_match: float
    budget_fit: float
    time_fit: float
    route_efficiency: float


class ItineraryTotals(CamelModel):
    cost: int
    time_hours: float
    distance_km: float
    place_count: int


class Itinerary(CamelModel):
    id: str
    input: TripInput
    days: list[ItineraryDay]
    totals: ItineraryTotals
    scores: ItineraryScores
    generated_at: str


ConstraintStatus = Literal["ok", "warning", "exceeded"]


class ConstraintCheckItem(CamelModel):
    key: Literal["budget", "time", "interest", "route"]
    label: str
    status: ConstraintStatus
    detail: str
    actual_label: str
    target_label: str
    percent: float


class ConstraintCheckResponse(CamelModel):
    """Not a frontend TS type on its own - the frontend's useItinerary hook
    just wants ConstraintCheckItem[]. Wrapped in an object here so the
    endpoint can also report the aggregate hasFailingConstraint flag
    (utils/constraints.ts's hasFailingConstraint) without the caller having
    to recompute it.
    """

    items: list[ConstraintCheckItem]
    has_failing_constraint: bool


class SavedTrip(CamelModel):
    itinerary: Itinerary
    saved_at: str
    group_matched: Optional[bool] = None


class OptimizeRequest(CamelModel):
    """Body for POST /api/trips/{id}/itinerary/optimize - overrides applied
    on top of the trip's existing input, mirroring what OptimizePanel /
    itineraryService.optimizeItinerary() vary: budget ceiling and per-day
    time cap.
    """

    budget_max: Optional[int] = None
    max_hours_per_day: Optional[float] = None


class OptimizeResponse(CamelModel):
    before: Itinerary
    after: Itinerary
    savings_cost: int
    savings_time_hours: float
