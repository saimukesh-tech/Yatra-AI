"""Mirrors src/types/traveler.ts exactly: Traveler, CompatibilityBreakdown,
TravelerGroup.
"""

from app.schemas.base import CamelModel
from app.schemas.trip import InterestKey


class Traveler(CamelModel):
    id: str
    label: str
    destination_id: str
    interests: list[InterestKey]
    start_time: str  # "09:00"
    end_time: str  # "18:00"
    budget: int
    duration_days: int


class CompatibilityBreakdown(CamelModel):
    destination_match: float
    interest_match: float
    time_match: float
    budget_match: float
    overall: float


class TravelerGroup(CamelModel):
    id: str
    label: str
    traveler_count: int
    travelers: list[Traveler]
    compatibility: CompatibilityBreakdown
    reasons: list[str]


class GroupMatchResponse(CamelModel):
    """Not itself a frontend TS type - useGroupMatching just wants
    TravelerGroup[] - but wrapping it lets the endpoint report why zero
    groups came back (e.g. no travelers above MIN_OVERALL_SCORE) without
    the caller having to guess from an empty array.
    """

    groups: list[TravelerGroup]
    candidates_considered: int
