"""No frontend TS type exists for this yet - ProfilePage.tsx currently
derives everything client-side from savedTrips plus a hardcoded "Demo
Traveler" name (see src/pages/Profile/ProfilePage.tsx). This is the
single-user, no-auth profile record the spec asked for (#15), shaped to
match what that page already displays (name/email + preferred interests)
so it's a drop-in data source once the frontend wires it up.
"""

from typing import Optional

from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.trip import InterestKey


class Profile(CamelModel):
    name: str
    email: str
    home_city: Optional[str] = None
    preferred_interests: list[InterestKey] = Field(default_factory=list)


class ProfileUpdate(CamelModel):
    name: Optional[str] = None
    email: Optional[str] = None
    home_city: Optional[str] = None
    preferred_interests: Optional[list[InterestKey]] = None
