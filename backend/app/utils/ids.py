"""Ported from src/utils/id.ts (generateId). Named ids.py to avoid shadowing
the builtin id()."""

import random
import time


def generate_id(prefix: str = "id") -> str:
    time_part = format(int(time.time() * 1000), "x")
    rand_part = "".join(random.choices("0123456789abcdefghijklmnopqrstuvwxyz", k=6))
    return f"{prefix}-{time_part}-{rand_part}"
