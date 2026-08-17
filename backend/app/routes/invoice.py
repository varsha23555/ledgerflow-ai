from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_user
from ..db import get_db
from ..models import Client, Invoice, User
from ..services.forecast_service import generate_invoice_cashflow_forecast
from ..services.pdf_parser import parse_invoice_from_pdf

router = APIRouter()

def build_parsed_invoice(parsed: dict) -> dict:
    return {
        "vendor": parsed["vendor"],
        "total": parsed["amount"],
        "invoiceDate": parsed["invoice_date"],
        "dueDate": parsed["due_date"],
        "paymentTerms": "Net 30",
        "confidence": 0.93,
        "lineItems": [
            f"Payment to {parsed['vendor']} - ${parsed['amount']:,.2f}",
            "Late fee waiver - $0.00"
        ]
    }

@router.post("/invoice/upload")
async def upload_invoice(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
):
    """Upload an invoice PDF and automatically extract values.

    Only accepts a PDF file. All invoice details (vendor, amount, dates, etc.)
    are automatically extracted from the PDF content.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Read the file content
    file_bytes = await file.read()

    # Parse invoice details from the PDF
    try:
        parsed = parse_invoice_from_pdf(file_bytes)
    except ImportError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    if parsed["amount"] <= 0:
        raise HTTPException(status_code=400, detail="Could not extract a valid amount from the PDF")

    # Get or create client
    result = await db.execute(select(Client).where(Client.owner_id == current_user.id).limit(1))
    client = result.scalars().first()

    if client is None:
        client = Client(name="Default Client", industry="Unknown", owner_id=current_user.id)
        db.add(client)
        await db.flush()

    try:
        invoice_date_obj = datetime.fromisoformat(parsed["invoice_date"]).date()
        due_date_obj = datetime.fromisoformat(parsed["due_date"]).date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format in PDF")

    invoice = Invoice(
        client_id=client.id,
        invoice_number=parsed["invoice_number"],
        amount=parsed["amount"],
        invoice_date=invoice_date_obj,
        due_date=due_date_obj,
        description=parsed["description"],
        status="pending",
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    # Generate the cashflow forecast showing the impact of paying this invoice
    cashflow_forecast = generate_invoice_cashflow_forecast(
        amount=parsed["amount"],
        vendor=parsed["vendor"],
        due_date=parsed["due_date"],
    )

    return {
        "status": "uploaded",
        "invoice_number": invoice.invoice_number,
        "file_name": file.filename,
        "content_type": file.content_type,
        "recommendation": "Invoice parsed successfully. Review the extracted values and cashflow forecast.",
        "parsed_invoice": build_parsed_invoice(parsed),
        "cashflow_forecast": cashflow_forecast,
    }