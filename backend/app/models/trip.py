"""SQLAlchemy model for a persisted trip - the DB-backed version of the
frontend's TripInput (src/types/trip.ts). interests is stored as JSON since
SQLite has no native array type.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, default=_new_id)

    destination_id = Column(String, nullable=False)
    destination_name = Column(String, nullable=False)
    budget_min = Column(Integer, nullable=False)
    budget_max = Column(Integer, nullable=False)
    duration_days = Column(Integer, nullable=False)
    duration_nights = Column(Integer, nullable=False)
    interests = Column(JSON, nullable=False, default=list)  # list[InterestKey]
    constraints = Column(Text, nullable=False, default="")
    travelers = Column(Integer, nullable=False, default=1)
    start_date = Column(String, nullable=True)

    created_at = Column(String, default=_now_iso)
    updated_at = Column(String, default=_now_iso, onupdate=_now_iso)

    itinerary = relationship(
        "Itinerary",
        back_populates="trip",
        uselist=False,
        cascade="all, delete-orphan",
    )
