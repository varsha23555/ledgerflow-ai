from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..models import User

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "user_email": current_user.email,
        "current_cash": 18320.0,
        "expected_inflows": 12600.0,
        "expected_outflows": 15200.0,
        "forecast": [
            {"date": "2026-08-10", "expected_cash": 18320.0},
            {"date": "2026-08-17", "expected_cash": 16050.0},
            {"date": "2026-08-24", "expected_cash": 13800.0},
            {"date": "2026-08-31", "expected_cash": 11750.0},
            {"date": "2026-09-07", "expected_cash": 9600.0},
        ],
        "upcoming_bills": [
            {"vendor": "Payroll", "amount": 6500.0, "due_date": "2026-08-15"},
            {"vendor": "Office Rent", "amount": 2800.0, "due_date": "2026-08-20"},
            {"vendor": "Cloud Services", "amount": 1200.0, "due_date": "2026-08-28"},
        ],
        "overdue_invoices": [
            {"invoice_number": "INV-1245", "vendor": "NorthStar Media", "amount": 4200.0, "due_date": "2026-07-28", "days_past_due": 12},
            {"invoice_number": "INV-1281", "vendor": "Atlas Logistics", "amount": 2500.0, "due_date": "2026-08-01", "days_past_due": 8},
        ],
        "risk_level": "Elevated",
        "warning": "Customer payment delays and upcoming payroll expose a cash shortage risk in 14 days.",
        "alert": "3 customers regularly pay 15-30 days late. Prepare for a potential shortfall.",
        "suggestions": [
            "Prioritize collection outreach for overdue invoices.",
            "Negotiate extended payment terms for the next rent cycle.",
            "Temporarily delay non-essential spend until inflows catch up.",
        ],
    }
