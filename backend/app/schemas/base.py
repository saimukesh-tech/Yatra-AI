"""Shared Pydantic base so every schema speaks camelCase on the wire while
staying snake_case in Python, matching the frontend's TypeScript field names
(destinationId, budgetMin, isEstimate, ...) exactly.

FastAPI's response_model_by_alias defaults to True, so any route typed with
a CamelModel subclass automatically serializes using the camelCase aliases
below - no per-route flag needed. populate_by_name=True means the models
also accept snake_case on the way in (handy for constructing them from
service/DB code), while still accepting camelCase from real HTTP requests.
"""

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
