"""AI Group Travel Match - ports src/utils/matching.ts +
src/services/groupMatchService.ts. Query params follow the frontend's actual
TripInput fields (destinationId, budgetMin, budgetMax, interests) rather
than the spec's example `travelStyle` param, since TripInput has no such
field.
"""

from fastapi import APIRouter, Query

from app.schemas.trip import InterestKey
from app.schemas.traveler import GroupMatchResponse
from app.services.group_match_service import find_compatible_groups

router = APIRouter(prefix="/group-match", tags=["group-match"])


@router.get("", response_model=GroupMatchResponse)
def get_group_matches(
    destination_id: str = Query(...),
    budget_min: int = Query(...),
    budget_max: int = Query(...),
    interests: list[InterestKey] = Query(default=[]),
):
    trip_input = {
        "destination_id": destination_id,
        "budget_min": budget_min,
        "budget_max": budget_max,
        "interests": interests,
    }
    groups, candidates_considered = find_compatible_groups(trip_input)
    return {"groups": groups, "candidates_considered": candidates_considered}
