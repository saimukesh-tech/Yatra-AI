from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.profile import DEFAULT_PROFILE_ID, Profile as ProfileORM
from app.schemas.profile import Profile, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])


def _get_or_create_profile(db: Session) -> ProfileORM:
    profile = db.query(ProfileORM).filter(ProfileORM.id == DEFAULT_PROFILE_ID).one_or_none()
    if profile is None:
        profile = ProfileORM(id=DEFAULT_PROFILE_ID)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=Profile)
def get_profile(db: Session = Depends(get_db)):
    return _get_or_create_profile(db)


@router.put("", response_model=Profile)
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
