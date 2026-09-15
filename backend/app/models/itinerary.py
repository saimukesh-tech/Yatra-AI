"""SQLAlchemy models for a generated itinerary - the DB-backed version of
src/types/itinerary.ts's Itinerary/ItineraryDay/ItineraryStop.

ItineraryItem stores enough to reconstruct an ItineraryStop (attraction_id +
time + reason + order); the full Attraction object is re-hydrated from
app/mock_data/attractions.py by id at read time (attractions are catalogue
data, not per-trip data, so they aren't duplicated into the DB row).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=_new_id)
    trip_id = Column(String, ForeignKey("trips.id"), nullable=False, unique=True)

    # Snapshot of the TripInput this itinerary was generated/optimized from
    # (kept as JSON since it's a nested object, not a fielded relation).
    input_snapshot = Column(JSON, nullable=False)

    total_cost = Column(Integer, nullable=False, default=0)
    total_time_hours = Column(Float, nullable=False, default=0)
    total_distance_km = Column(Float, nullable=False, default=0)
    total_place_count = Column(Integer, nullable=False, default=0)

    score_interest_match = Column(Float, nullable=False, default=0)
    score_budget_fit = Column(Float, nullable=False, default=0)
    score_time_fit = Column(Float, nullable=False, default=0)
    score_route_efficiency = Column(Float, nullable=False, default=0)

    generated_at = Column(String, default=_now_iso)

    trip = relationship("Trip", back_populates="itinerary")
    days = relationship(
        "ItineraryDay",
        back_populates="itinerary",
        cascade="all, delete-orphan",
        order_by="ItineraryDay.day_number",
    )


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(Integer, primary_key=True, autoincrement=True)
    itinerary_id = Column(String, ForeignKey("itineraries.id"), nullable=False)

    day_number = Column(Integer, nullable=False)
    label = Column(String, nullable=False)
    summary = Column(Text, nullable=False, default="")

    itinerary = relationship("Itinerary", back_populates="days")
    items = relationship(
        "ItineraryItem",
        back_populates="day",
        cascade="all, delete-orphan",
        order_by="ItineraryItem.order_index",
    )


class ItineraryItem(Base):
    """One stop in a day - maps to ItineraryStop { attraction, time, reason }."""

    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    day_id = Column(Integer, ForeignKey("itinerary_days.id"), nullable=False)

    order_index = Column(Integer, nullable=False, default=0)
    attraction_id = Column(String, nullable=False)  # references mock_data attraction id (or "generic-..." for freeform destinations)
    # Full Attraction snapshot (JSON), stored alongside the id so a stop
    # still renders correctly even for the "generic" fallback attractions
    # that don't exist in app/mock_data/attractions.py's catalogue.
    attraction_snapshot = Column(JSON, nullable=False)
    time = Column(String, nullable=False)  # "09:00 AM"
    reason = Column(Text, nullable=False, default="")

    day = relationship("ItineraryDay", back_populates="items")
