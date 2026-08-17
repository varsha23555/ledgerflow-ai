from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

from ..auth import get_current_user
from ..models import User
from ..services.forecast_service import generate_invoice_cashflow_forecast

router = APIRouter()

class ForecastRequest(BaseModel):
    client_id: int
    horizon_days: int = 90

class ForecastPoint(BaseModel):
    date: str
    cash_balance: float

class ForecastResponse(BaseModel):
    client_id: int
    horizon_days: int
    forecast: List[ForecastPoint]
    suggestions: List[str]

class InvoiceForecastRequest(BaseModel):
    amount: float
    vendor: str
    due_date: str
    current_cash_balance: Optional[float] = 18320.0
    horizon_days: int = 90

@router.post("/forecast", response_model=ForecastResponse)
async def create_forecast(payload: ForecastRequest):
    today = "2026-08-09"
    forecast = [
        {"date": "2026-08-10", "cash_balance": 12000.0},
        {"date": "2026-08-30", "cash_balance": 9400.0},
        {"date": "2026-09-28", "cash_balance": 7600.0}
    ]
    return {
        "client_id": payload.client_id,
        "horizon_days": payload.horizon_days,
        "forecast": forecast,
        "suggestions": [
            "Follow up on overdue invoices immediately.",
            "Temporarily delay non-essential spending in the next 30 days.",
            "Ask clients for accelerated payment terms on two large receivables."
        ]
    }

@router.post("/forecast/invoice")
async def create_invoice_forecast(
    payload: InvoiceForecastRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a cashflow forecast showing the impact of paying an invoice.

    Example: Upload an invoice for payment to John for $2,500 due in 14 days.
    This returns the projected cash balance after the payment is made.
    """
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    if not payload.vendor.strip():
        raise HTTPException(status_code=400, detail="Vendor/payee name is required")

    result = generate_invoice_cashflow_forecast(
        amount=payload.amount,
        vendor=payload.vendor.strip(),
        due_date=payload.due_date,
        current_cash_balance=payload.current_cash_balance,
        horizon_days=payload.horizon_days,
    )

    return {
        "user_email": current_user.email,
        **result,
    }