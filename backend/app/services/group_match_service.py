"""Faithful Python port of src/utils/matching.ts + src/services/groupMatchService.ts.

Weighted: Interest 40%, Time 30%, Destination 20%, Budget 10% - kept modular
and pure (plain dicts in, plain dicts out) exactly like the frontend's
comment describes, so this is the natural place a future real matching
backend (or LangGraph agent) would slot in.
"""

from app.mock_data.travelers import get_travelers_for
from app.utils.ids import generate_id

WEIGHTS = {
    "interest": 0.4,
    "time": 0.3,
    "destination": 0.2,
    "budget": 0.1,
}

MIN_OVERALL_SCORE = 55


def interest_similarity(a: list[str], b: list[str]) -> float:
    if not a or not b:
        return 0
    set_a, set_b = set(a), set(b)
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return round((intersection / union) * 100) if union else 0


def _to_minutes(time_str: str) -> int:
    h, m = time_str.split(":")
    return int(h) * 60 + int(m)


def time_overlap_score(a_start: str, a_end: str, b_start: str, b_end: str) -> float:
    start = max(_to_minutes(a_start), _to_minutes(b_start))
    end = min(_to_minutes(a_end), _to_minutes(b_end))
    overlap = max(0, end - start)
    span_a = _to_minutes(a_end) - _to_minutes(a_start)
    span_b = _to_minutes(b_end) - _to_minutes(b_start)
    shortest_span = min(span_a, span_b) or 1
    return round((overlap / shortest_span) * 100)


def budget_compatibility_score(budget_a: float, budget_b: float) -> float:
    if budget_a <= 0 or budget_b <= 0:
        return 0
    diff = abs(budget_a - budget_b)
    avg = (budget_a + budget_b) / 2
    ratio = diff / avg
    return round(max(0, 100 - ratio * 100))


def destination_match_score(dest_a: str, dest_b: str) -> float:
    return 100 if dest_a == dest_b else 0


def compute_compatibility(self_input: dict, other: dict) -> dict:
    """self_input: {destination_id, interests, start_time, end_time, budget}
    other: a traveler dict (from mock_data.travelers).
    """
    destination_match = destination_match_score(self_input["destination_id"], other["destination_id"])
    interest_match = interest_similarity(self_input["interests"], other["interests"])
    time_match = time_overlap_score(
        self_input["start_time"], self_input["end_time"], other["start_time"], other["end_time"]
    )
    budget_match = budget_compatibility_score(self_input["budget"], other["budget"])

    overall = round(
        interest_match * WEIGHTS["interest"]
        + time_match * WEIGHTS["time"]
        + destination_match * WEIGHTS["destination"]
        + budget_match * WEIGHTS["budget"]
    )

    return {
        "destination_match": destination_match,
        "interest_match": interest_match,
        "time_match": time_match,
        "budget_match": budget_match,
        "overall": overall,
    }


def build_group_reasons(breakdown: dict, traveler_count: int) -> list[str]:
    reasons = []
    if breakdown["destination_match"] >= 100:
        reasons.append("Same destination")
    if breakdown["time_match"] >= 60:
        reasons.append("Overlapping schedule")
    if breakdown["interest_match"] >= 50:
        reasons.append("Similar interests")
    if breakdown["budget_match"] >= 60:
        reasons.append("Compatible budget")
    if traveler_count >= 2:
        reasons.append(f"{traveler_count} travelers heading the same way")
    return reasons


def _aggregate_breakdown(items: list[dict]) -> dict:
    def avg(key: str) -> float:
        return round(sum(b[key] for b in items) / len(items))

    return {
        "destination_match": avg("destination_match"),
        "interest_match": avg("interest_match"),
        "time_match": avg("time_match"),
        "budget_match": avg("budget_match"),
        "overall": avg("overall"),
    }


def find_compatible_groups(trip_input: dict) -> tuple[list[dict], int]:
    """Returns (groups, candidates_considered)."""
    self_input = {
        "destination_id": trip_input["destination_id"],
        "interests": trip_input["interests"],
        "start_time": "09:00",
        "end_time": "18:00",
        # Midpoint of the user's budget range, not the ceiling - reflects
        # typical spend rather than the max they'd tolerate worst-case.
        "budget": round((trip_input["budget_min"] + trip_input["budget_max"]) / 2),
    }

    pool = get_travelers_for(trip_input["destination_id"])
    candidates = sorted(
        (
            {"traveler": t, "breakdown": compute_compatibility(self_input, t)}
            for t in pool
        ),
        key=lambda c: c["breakdown"]["overall"],
        reverse=True,
    )
    candidates = [c for c in candidates if c["breakdown"]["overall"] >= MIN_OVERALL_SCORE]

    if not candidates:
        return [], len(pool)

    groups = []

    primary = candidates[:4]
    primary_breakdown = _aggregate_breakdown([c["breakdown"] for c in primary])
    groups.append(
        {
            "id": generate_id("grp"),
            "label": "Travel Group A",
            "traveler_count": len(primary),
            "travelers": [c["traveler"] for c in primary],
            "compatibility": primary_breakdown,
            "reasons": build_group_reasons(primary_breakdown, len(primary)),
        }
    )

    secondary = candidates[4:8]
    if len(secondary) >= 2:
        secondary_breakdown = _aggregate_breakdown([c["breakdown"] for c in secondary])
        groups.append(
            {
                "id": generate_id("grp"),
                "label": "Travel Group B",
                "traveler_count": len(secondary),
                "travelers": [c["traveler"] for c in secondary],
                "compatibility": secondary_breakdown,
                "reasons": build_group_reasons(secondary_breakdown, len(secondary)),
            }
        )

    return groups, len(pool)
