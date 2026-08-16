from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

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
