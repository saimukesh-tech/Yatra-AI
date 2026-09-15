"""Faithful Python port of src/services/transportService.ts.

Estimation-only, exactly as the frontend comment states: no real transport /
booking API is connected, every figure is clearly an estimate, and no
vehicle is ever claimed to be booked. isEstimate is always True.
"""

from app.mock_data.transport import PER_PERSON_INDIVIDUAL_COST, SHARED_SAVINGS_RATIO, vehicle_for


def estimate_transport(group_size: int) -> dict:
    individual_total = group_size * PER_PERSON_INDIVIDUAL_COST
    shared_total = round(individual_total * SHARED_SAVINGS_RATIO)
    vehicle_info = vehicle_for(group_size)

    savings_total = individual_total - shared_total
    savings_per_person = round(savings_total / group_size) if group_size else 0

    return {
        "group_size": group_size,
        "individual": {"ride_count": group_size, "total_cost": individual_total},
        "shared": {
            "vehicle": vehicle_info["vehicle"],
            "capacity": vehicle_info["capacity"],
            "total_cost": shared_total,
            "cost_per_person": round(shared_total / group_size) if group_size else 0,
        },
        "savings_total": savings_total,
        "savings_per_person": savings_per_person,
        "is_estimate": True,
    }
