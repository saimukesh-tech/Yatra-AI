"""Single-row profile table - no auth, no multi-user support (per spec
#15/#21), just one persisted record so GET/PUT round-trip through SQLite
instead of an in-memory dict that resets on restart.
"""

from sqlalchemy import JSON, Column, String

from app.core.database import Base

DEFAULT_PROFILE_ID = "default"


class Profile(Base):
    __tablename__ = "profile"

    id = Column(String, primary_key=True, default=DEFAULT_PROFILE_ID)
    name = Column(String, nullable=False, default="Demo Traveler")
    email = Column(String, nullable=False, default="demo@yatraai.app")
    home_city = Column(String, nullable=True)
    preferred_interests = Column(JSON, nullable=False, default=list)
