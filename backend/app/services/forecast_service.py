from datetime import datetime, timedelta
from typing import List

import numpy as np


def generate_cashflow_forecast(horizon_days: int = 90) -> List[dict]:
    today = datetime.utcnow().date()
    forecast = []
    balance = 12000.0
    for day in range(1, horizon_days + 1):
        date = today + timedelta(days=day)
        balance += 20.0 if date.weekday() < 5 else -15.0
        forecast.append({"date": date.isoformat(), "cash_balance": round(balance, 2)})
    return forecast


def detect_liquidity_risk(forecast: List[dict]) -> List[str]:
    low_points = [point for point in forecast if point["cash_balance"] < 5000.0]
    if not low_points:
        return ["Cash flow is stable through the forecast horizon."]
    return [
        f"Projected shortfall on {low_points[0]['date']} with closing balance {low_points[0]['cash_balance']}",
        "Recommend shifting 2 invoices to ACH and negotiating 7-day payment terms for key accounts.",
    ]
