"""Faithful Python port of src/utils/constraints.ts."""

from app.utils.budget import format_currency, percentage

AVAILABLE_HOURS_PER_DAY = 7  # ~7 productive touring hours/day


def _available_hours_for(days: int) -> float:
    return days * AVAILABLE_HOURS_PER_DAY


def build_constraint_checks(itinerary: dict) -> list[dict]:
    trip_input = itinerary["input"]
    totals = itinerary["totals"]
    scores = itinerary["scores"]
    available_hours = _available_hours_for(trip_input["duration_days"])

    budget_max = trip_input["budget_max"]
    if totals["cost"] <= budget_max:
        budget_status = "ok"
    elif totals["cost"] <= budget_max * 1.15:
        budget_status = "warning"
    else:
        budget_status = "exceeded"

    time_hours = totals["time_hours"]
    if time_hours <= available_hours:
        time_status = "ok"
    elif time_hours <= available_hours * 1.15:
        time_status = "warning"
    else:
        time_status = "exceeded"

    interest_match = scores["interest_match"]
    if interest_match >= 80:
        interest_status = "ok"
    elif interest_match >= 60:
        interest_status = "warning"
    else:
        interest_status = "exceeded"

    route_efficiency = scores["route_efficiency"]
    if route_efficiency >= 75:
        route_status = "ok"
    elif route_efficiency >= 55:
        route_status = "warning"
    else:
        route_status = "exceeded"

    if budget_status == "exceeded":
        budget_detail = f"Budget exceeded by {format_currency(totals['cost'] - budget_max)}"
    elif budget_status == "warning":
        budget_detail = f"Slightly over target by {format_currency(totals['cost'] - budget_max)}"
    else:
        budget_detail = f"{format_currency(budget_max - totals['cost'])} to spare"

    if time_status == "exceeded":
        time_detail = f"Itinerary runs {(time_hours - available_hours):.1f}h over your available time"
    else:
        time_detail = f"Fits within your available {available_hours}h window"

    interest_detail = (
        "Highly personalized to what you love"
        if interest_status == "ok"
        else "Consider adding more interests for a stronger match"
    )

    route_detail = (
        "Minimal backtracking between stops" if route_status == "ok" else "Some stops require extra travel time"
    )

    return [
        {
            "key": "budget",
            "label": "Budget",
            "status": budget_status,
            "detail": budget_detail,
            "actual_label": format_currency(totals["cost"]),
            "target_label": format_currency(budget_max),
            "percent": percentage(totals["cost"], budget_max),
        },
        {
            "key": "time",
            "label": "Available Time",
            "status": time_status,
            "detail": time_detail,
            "actual_label": f"{time_hours:.1f}h",
            "target_label": f"{available_hours}h",
            "percent": percentage(time_hours, available_hours),
        },
        {
            "key": "interest",
            "label": "Interest Match",
            "status": interest_status,
            "detail": interest_detail,
            "actual_label": f"{interest_match}%",
            "target_label": "100%",
            "percent": interest_match,
        },
        {
            "key": "route",
            "label": "Route Efficiency",
            "status": route_status,
            "detail": route_detail,
            "actual_label": f"{route_efficiency}%",
            "target_label": "100%",
            "percent": route_efficiency,
        },
    ]


def has_failing_constraint(checks: list[dict]) -> bool:
    return any(c["status"] == "exceeded" for c in checks)
