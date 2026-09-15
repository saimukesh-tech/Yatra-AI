"""Mirrors src/types/transport.ts exactly: IndividualTravelEstimate,
SharedTravelEstimate, TransportComparison. Plus TransportOption, which backs
the bonus /api/transport/options endpoint that the current frontend does not
call (see app/mock_data/transport.py docstring) - there is no frontend TS
type for it, so its shape follows the request spec instead.
"""

from typing import Literal

from app.schemas.base import CamelModel


class IndividualTravelEstimate(CamelModel):
    ride_count: int
    total_cost: int


class SharedTravelEstimate(CamelModel):
    vehicle: str
    capacity: int
    total_cost: int
    cost_per_person: int


class TransportComparison(CamelModel):
    group_size: int
    individual: IndividualTravelEstimate
    shared: SharedTravelEstimate
    savings_total: int
    savings_per_person: int
    is_estimate: Literal[True] = True


class TransportOption(CamelModel):
    """One intercity search result (bonus endpoint, no frontend consumer
    yet - see mock_data/transport.py).
    """

    mode: Literal["Flight", "Train", "Bus"]
    provider: str
    price: int
    duration: str
    origin: str
    destination: str
