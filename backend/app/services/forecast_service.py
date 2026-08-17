from datetime import datetime, timedelta
from typing import List, Optional


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


def generate_invoice_cashflow_forecast(
    amount: float,
    vendor: str,
    due_date: str,
    current_cash_balance: float = 18320.0,
    horizon_days: int = 90,
) -> dict:
    """Generate a cashflow forecast showing the impact of paying an invoice.

    Args:
        amount: The invoice amount to be paid.
        vendor: The payee/vendor name (e.g. "John").
        due_date: ISO date string when the payment is due.
        current_cash_balance: The banking institution's current cash balance.
        horizon_days: Number of days to forecast.

    Returns:
        A dict with the current balance, projected balance after payment,
        the impact, and a timeline forecast.
    """
    today = datetime.utcnow().date()
    try:
        due = datetime.fromisoformat(due_date).date()
    except ValueError:
        due = today + timedelta(days=30)

    # Projected balance after the invoice is paid
    projected_balance = current_cash_balance - amount

    # Build a timeline: daily cash balance from today through the horizon
    timeline = []
    balance = current_cash_balance
    for day in range(0, horizon_days + 1):
        date = today + timedelta(days=day)
        # Apply the invoice payment on the due date
        if date == due:
            balance -= amount
        # Simulate small daily inflows/outflows for realism
        elif date.weekday() < 5:
            balance += 20.0
        else:
            balance -= 15.0
        timeline.append({"date": date.isoformat(), "cash_balance": round(balance, 2)})

    # Key milestone points for the summary view
    milestones = []
    for offset in (0, 7, 14, 30, 60, 90):
        if offset <= horizon_days:
            point = timeline[offset]
            milestones.append(point)

    # Determine risk level
    if projected_balance < 0:
        risk_level = "Critical"
        warning = f"Paying {vendor} ${amount:,.2f} will overdraw the account. Projected balance: ${projected_balance:,.2f}."
    elif projected_balance < 5000:
        risk_level = "Elevated"
        warning = f"Paying {vendor} ${amount:,.2f} leaves a thin cash buffer of ${projected_balance:,.2f}."
    else:
        risk_level = "Healthy"
        warning = f"Paying {vendor} ${amount:,.2f} is safe. Projected balance after payment: ${projected_balance:,.2f}."

    suggestions = []
    if projected_balance < 5000:
        suggestions.append("Consider negotiating extended payment terms with the vendor.")
        suggestions.append("Prioritize collecting outstanding receivables before the due date.")
        suggestions.append("Review non-essential spending to preserve liquidity.")
    else:
        suggestions.append("Cash position remains healthy after this payment.")
        suggestions.append("Continue monitoring upcoming obligations to avoid future shortfalls.")

    return {
        "vendor": vendor,
        "invoice_amount": amount,
        "due_date": due.isoformat(),
        "current_cash_balance": current_cash_balance,
        "projected_cash_after_payment": round(projected_balance, 2),
        "cash_impact": round(-amount, 2),
        "risk_level": risk_level,
        "warning": warning,
        "timeline": timeline,
        "milestones": milestones,
        "suggestions": suggestions,
    }