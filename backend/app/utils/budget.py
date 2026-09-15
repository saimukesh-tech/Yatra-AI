"""Ported 1:1 from src/utils/budget.ts (the pieces the backend needs)."""


def format_currency(amount: float) -> str:
    return f"₹{round(amount):,}"


def clamp(value: float, lo: float, hi: float) -> float:
    return min(hi, max(lo, value))


def percentage(value: float, total: float) -> float:
    if total <= 0:
        return 0
    return clamp(round((value / total) * 100), 0, 100)
