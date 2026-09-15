"""Two endpoints, matching the two mock_data sources (see
app/mock_data/transport.py docstring):

- /estimate: what the frontend's transportService.ts actually needs (shared
  local transport for a matched travel group). Always isEstimate=true.
- /options: the origin/destination/date intercity search requested in the
  backend spec; no frontend UI calls this yet.
"""

from fastapi import APIRouter, Query

from app.mock_data.transport import intercity_options
from app.schemas.transport import TransportComparison, TransportOption
from app.services.transport_service import estimate_transport

router = APIRouter(prefix="/transport", tags=["transport"])


@router.get("/estimate", response_model=TransportComparison)
def get_transport_estimate(group_size: int = Query(gt=0)):
    return estimate_transport(group_size)


@router.get("/options", response_model=list[TransportOption])
def get_transport_options(
    origin: str = Query(...),
    destination: str = Query(...),
    date: str | None = Query(default=None),
):
    # `date` isn't used to vary the mock results (there's no real fare
    # calendar behind this), but it's accepted so the endpoint shape matches
    # a real origin/destination/date search.
    return intercity_options(origin, destination)
