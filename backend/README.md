# Yatra AI API

A basic FastAPI backend for the YatraAI frontend (`../src`). Mock/rule-based
logic only — no authentication, no external AI calls, no real transport
booking. It exists to give the frontend a real HTTP API with the exact same
data shapes it already uses, and to give a future AI layer (see
[What's LangGraph-replaceable later](#whats-langgraph-replaceable-later)) a
stable seam to plug into.

## 1. Structure

```
backend/
  app/
    core/           # settings (config.py), SQLAlchemy engine/session (database.py)
    models/         # SQLAlchemy ORM models: Trip, Itinerary/ItineraryDay/ItineraryItem, Profile
    schemas/        # Pydantic request/response models (camelCase on the wire)
    routers/        # thin FastAPI routers: health, trips, itinerary, destinations, transport, group_match, profile
    services/       # pure business logic, ported 1:1 from the frontend's TS services/utils
    mock_data/      # catalogue data ported 1:1 from src/data/*.ts
    utils/          # small ported helpers (budget formatting, id generation)
    main.py         # FastAPI app: CORS, exception handlers, router wiring
  tests/            # pytest suite (35 tests)
  run.py            # `python run.py` dev entrypoint
  requirements.txt
  .env.example
```

Routers only validate input and call a service function; all logic (scoring
formulas, itinerary packing, constraint thresholds) lives in `app/services/`
as plain, dict-in/dict-out functions so it's independently testable and easy
to swap out later.

## 2. Endpoints

All routes are under `/api`. Interactive docs: `GET /docs` (Swagger) and
`GET /openapi.json`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness check |
| POST | `/api/trips` | Create a trip (frontend's `TripInput` fields) |
| GET | `/api/trips` | List all trips |
| GET | `/api/trips/{id}` | Get one trip |
| PUT | `/api/trips/{id}` | Partially update a trip |
| DELETE | `/api/trips/{id}` | Delete a trip (cascades its itinerary) |
| POST | `/api/trips/{id}/generate` | Generate (and persist) a mock itinerary for the trip |
| GET | `/api/trips/{id}/itinerary` | Get the trip's generated itinerary |
| GET | `/api/trips/{id}/itinerary/day/{n}` | Get one day of the itinerary |
| POST | `/api/trips/{id}/itinerary/check` | Rule-based constraint/health check |
| POST | `/api/trips/{id}/itinerary/optimize` | Regenerate with overrides (budget/hours), returns before/after + savings |
| GET | `/api/trips/{id}/itinerary/items/{item_id}/alternatives` | Suggest swap-in attractions for one stop *(not called by the current UI yet — see §9)* |
| PUT | `/api/trips/{id}/itinerary/items/{item_id}` | Swap one stop's attraction, recompute totals *(not called by the current UI yet)* |
| GET | `/api/destinations` | List destinations (`?popular=true` to filter) |
| GET | `/api/destinations/{id}` | One destination |
| GET | `/api/destinations/{id}/attractions` | Attractions for a destination |
| GET | `/api/transport/estimate?group_size=N` | Shared-vs-individual transport estimate (what the frontend needs) |
| GET | `/api/transport/options?origin=&destination=&date=` | Mock intercity flight/train/bus search *(bonus, no current UI consumer)* |
| GET | `/api/group-match?destination_id=&budget_min=&budget_max=&interests=` | AI Group Travel Match |
| GET | `/api/profile` | Get the single demo profile |
| PUT | `/api/profile` | Update it |

Errors are always `{"detail": "..."}` with standard status codes (400/404/422/500).

## 3. Database models (SQLite via SQLAlchemy)

- **Trip** — one row per planned trip; the DB-backed version of `TripInput`.
- **Itinerary** — one row per generated itinerary (1:1 with a Trip, replaced on regenerate/optimize), holding totals + scores and an `input_snapshot` JSON (the exact `TripInput` used to generate it).
- **ItineraryDay** — one row per day, belongs to an Itinerary.
- **ItineraryItem** — one row per stop, belongs to a Day. Stores both `attraction_id` and a full `attraction_snapshot` JSON so a stop still renders even for the "generic" fallback attractions used when a freeform/unrecognized destination is passed in.
- **Profile** — single row (`id="default"`), no auth/multi-user support.

Attractions/destinations/travelers themselves are **not** stored in the DB — they're catalogue data served straight from `app/mock_data/*.py`, exactly like the frontend serves them from `src/data/*.ts`.

## 4. Frontend connection

`src/services/api.ts` already had `apiFetch()` / `API_BASE_URL` written for
this (it just wasn't called by anything). This backend now serves the exact
JSON shapes `src/types/*.ts` expects — every schema in `app/schemas/` uses a
camelCase alias generator, so `GET /api/destinations` returns
`{"sceneType": ..., "avgDailyBudget": ...}`, not snake_case.

Nothing was rewired: the UI still runs entirely on the mock services by
default. To actually connect a service, add `.env` (see `../.env.example`)
with `VITE_API_BASE_URL=http://localhost:8000/api`, then swap that one
service's body for `return apiFetch(...)`. See §12 for the exact list of
frontend files touched in this pass (none of them change runtime behavior).

## 5. Install & run

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # defaults already work as-is
python -m uvicorn app.main:app --reload   # or: python run.py
```

Server: `http://localhost:8000`. Docs: `http://localhost:8000/docs`. A
`yatra_ai.db` SQLite file is created automatically on first startup.

## 6. Example request/response

Generate an itinerary end to end:

```bash
curl -X POST http://localhost:8000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "destinationId": "hyderabad", "destinationName": "Hyderabad",
    "budgetMin": 1500, "budgetMax": 3000,
    "durationDays": 2, "durationNights": 1,
    "interests": ["history", "food", "photography"],
    "constraints": "Prefer less travel", "travelers": 2
  }'
# -> {"id":"c91d543b6bed","destinationId":"hyderabad", ..., "hasItinerary":false}

curl -X POST http://localhost:8000/api/trips/c91d543b6bed/generate
# -> {
#      "id": "itin-...", "input": {...},
#      "days": [{"dayNumber":1,"label":"Day 1","summary":"History, Photography, Adventure",
#                 "stops":[{"attraction":{"id":"hyd-charminar","name":"Charminar",...},
#                           "time":"9:00 AM","reason":"Strong match for your interest in History and Photography."}]}],
#      "totals": {"cost":700,"timeHours":9.2,"distanceKm":34,"placeCount":6},
#      "scores": {"interestMatch":98,"budgetFit":100,"timeFit":100,"routeEfficiency":82},
#      "generatedAt": "2026-09-15T09:57:xx+00:00"
#    }
```

## 7. Test results

```
35 passed in 0.54s
```

Covers (among others): health/CORS/docs, trip CRUD + validation errors,
generate + persistence, itinerary get/day/check/optimize, activity
alternatives + replace (+recompute), destinations list/detail/attractions,
transport estimate + options, group-match (+ unknown-destination edge case),
profile get/put. Run with `pytest -v` from `backend/`.

Manually verified live against a running server: full trip lifecycle
(create → generate → check → optimize → replace an activity → delete,
cascading its itinerary), CORS preflight from `http://localhost:5173`, and
every 404/422 error path.

## 8. What's mock data

Everything. `app/mock_data/destinations.py`, `attractions.py`,
`travelers.py` are ported field-for-field from `src/data/mockDestinations.ts`,
`mockAttractions.ts`, `mockTravelers.ts` (same ids, so a `destinationId`
lines up on both sides). `app/mock_data/transport.py` holds the constants
`transportService.ts` uses plus a small deterministic generator for the
bonus intercity-search endpoint. There is no external API call anywhere in
this backend.

## 9. What's LangGraph-replaceable later

`app/services/itinerary_service.py`'s `generate_itinerary(trip_input: dict) -> dict`
and `optimize_itinerary(...)` are the intended seam: today they run a
deterministic, rule-based packing algorithm (ported from
`itineraryService.ts`) against `app/mock_data/attractions.py`. A future
LangGraph multi-agent pipeline could replace the *inside* of those two
functions — e.g. an agent that reasons over attractions, budget and
constraints — as long as it still returns the same `Itinerary` dict shape
(`id`, `input`, `days`, `totals`, `scores`, `generated_at`). Nothing in
`app/routers/trips.py` or `app/routers/itinerary.py` would need to change.
The same is true of `app/services/group_match_service.py`'s
`find_compatible_groups()` for a future "smarter" matching agent.

The activity-alternatives/replace endpoints (`GET .../items/{id}/alternatives`,
`PUT .../items/{item_id}`) were built even though the current frontend UI
has no "swap this activity" control yet — they're ready for when it does.

## 10. Deliberate deviations from the original spec's illustrative examples

Per instructions, the frontend's actual types/data won out over the
prompt's example field names wherever they conflicted:

- **Destinations**: the real 12-city catalogue (Hyderabad, Araku Valley,
  Hampi, Kerala, Ladakh, Madurai, Goa, Ooty, Bengaluru, Delhi, Mumbai,
  Chennai) rather than the prompt's example list — Jaipur/Manali/Udaipur/
  Varanasi/Mysore don't exist in the frontend's mock data.
- **Constraint check**: response uses the frontend's actual
  `ConstraintCheckItem[]` shape (`key`/`label`/`status`/`detail`/
  `actualLabel`/`targetLabel`/`percent` for budget/time/interest/route)
  rather than the prompt's example nested `{budget, time, distance, overall}`
  object — there's no "distance" constraint in the frontend at all.
- **Group match query params**: `destination_id`/`budget_min`/`budget_max`/
  `interests` (real `TripInput` fields) rather than the prompt's example
  `travel_style` param, which `TripInput` has no equivalent of.
- **Transport**: two endpoints — `/transport/estimate`, matching what
  `transportService.ts` actually needs, plus `/transport/options`
  (origin/destination/date search) as the explicitly-requested bonus
  endpoint the current UI doesn't call anywhere yet.

## 11. Known simplifications

- One itinerary per trip (generating/optimizing replaces the previous one,
  matching how the frontend's single-itinerary-per-planning-session flow
  works) rather than a full itinerary history.
- `PUT /itinerary/items/{item_id}` takes `attraction_id` as a query param
  (a single-field replacement) rather than a JSON body, since that's all it
  changes.
- Profile is a single unauthenticated row — there's no frontend TS type for
  it yet (`ProfilePage.tsx` currently derives everything client-side from
  `savedTrips`), so its shape follows what that page already displays.

## 12. Frontend files touched

Only two, both additive/non-breaking (verified with `npx tsc -b` — no
errors):

- **`src/services/api.ts`** — added a doc comment pointing at this backend
  and how to connect a service to it. `apiFetch`/`API_BASE_URL` themselves
  are unchanged; no service was rewired, so the app still runs entirely on
  mock data by default.
- **`.env.example`** *(new file, repo root)* — documents the optional
  `VITE_API_BASE_URL` variable for when the frontend is later wired to this
  backend.

No component, hook, service, type, or mock data file in `src/` was modified
or deleted.
