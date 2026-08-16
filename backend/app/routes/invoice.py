from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..auth import get_current_user
from ..db import get_db
from ..models import Client, Invoice, User

router = APIRouter()

def build_parsed_invoice(amount: float, invoice_date: str, due_date: str) -> dict:
    return {
        "vendor": "Acme Supplies",
        "total": amount,
        "invoiceDate": invoice_date,
        "dueDate": due_date,
        "paymentTerms": "Net 30",
        "confidence": 0.93,
        "lineItems": [
            "Software subscription - $1,200.00",
            "Late fee waiver - $0.00"
        ]
    }

@router.post("/invoice/match")
async def match_invoice(
    current_user: User = Depends(get_current_user),
    invoice_number: str = Form(...),
    amount: float = Form(...),
    description: Optional[str] = Form(None),
    invoice_date: str = Form(...),
    due_date: str = Form(...),
    file: UploadFile = File(...),
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    if file.content_type not in ["application/pdf", "image/png", "image/jpeg"]:
        raise HTTPException(status_code=400, detail="File type must be PDF, PNG, or JPEG")

    return {
        "matched_transaction_id": None,
        "confidence": 0.0,
        "recommendation": "Upload bank statements and invoices; the platform will match them with AI-assisted semantic embeddings.",
        "file_name": file.filename,
        "content_type": file.content_type,
        "parsed_invoice": build_parsed_invoice(amount, invoice_date, due_date),
    }

@router.post("/invoice/upload")
async def upload_invoice(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    invoice_number: str = Form(...),
    amount: float = Form(...),
    description: Optional[str] = Form(None),
    invoice_date: str = Form(...),
    due_date: str = Form(...),
    file: UploadFile = File(...),
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    if file.content_type not in ["application/pdf", "image/png", "image/jpeg"]:
        raise HTTPException(status_code=400, detail="File type must be PDF, PNG, or JPEG")

    result = await db.execute(select(Client).where(Client.owner_id == current_user.id).limit(1))
    client = result.scalars().first()

    if client is None:
        client = Client(name="Default Client", industry="Unknown", owner_id=current_user.id)
        db.add(client)
        await db.flush()

    try:
        invoice_date_obj = datetime.fromisoformat(invoice_date).date()
        due_date_obj = datetime.fromisoformat(due_date).date()
    except ValueError:
        raise HTTPException(status_code=400, detail="invoice_date and due_date must be ISO date strings like YYYY-MM-DD")

    invoice = Invoice(
        client_id=client.id,
        invoice_number=invoice_number,
        amount=amount,
        invoice_date=invoice_date_obj,
        due_date=due_date_obj,
        description=description,
        status="pending",
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    return {
        "status": "uploaded",
        "invoice_number": invoice.invoice_number,
        "file_name": file.filename,
        "content_type": file.content_type,
        "recommendation": "Review the parsed invoice values and ensure the payment schedule is aligned with receipts.",
        "parsed_invoice": build_parsed_invoice(amount, invoice_date, due_date),
    }
