import re
from datetime import datetime, timedelta
from typing import Optional

try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    if not HAS_PYPDF2:
        raise ImportError("PyPDF2 is required for PDF parsing. Install with: pip install PyPDF2")

    from io import BytesIO
    reader = PyPDF2.PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text += page_text + "\n"
    return text


def parse_invoice_from_pdf(file_bytes: bytes) -> dict:
    """Parse invoice details from a PDF file.

    Extracts: vendor, amount, invoice_date, due_date, invoice_number, description
    """
    text = extract_text_from_pdf(file_bytes)

    # Extract vendor/payee name
    vendor = "Unknown Vendor"
    vendor_match = re.search(r"(?:Vendor|Payee|Bill To|From|Supplier)[:\s]+([A-Za-z0-9\s\.\-]+)", text, re.IGNORECASE)
    if vendor_match:
        vendor = vendor_match.group(1).strip().split("\n")[0].strip()

    # Extract invoice number
    invoice_number = f"INV-{int(datetime.utcnow().timestamp())}"
    inv_match = re.search(r"(?:Invoice\s*(?:Number|#|No\.?)|INV)[:\s#]*([A-Za-z0-9\-]+)", text, re.IGNORECASE)
    if inv_match:
        candidate = inv_match.group(1).strip()
        # Skip if the match is just part of the word "INVOICE"
        if candidate.lower() not in ("oice", "invoice", "number", "no"):
            invoice_number = candidate

    # Extract total amount
    amount = 0.0
    amount_match = re.search(r"(?:Total|Amount|Balance|Grand\s*Total)[:\s]*\$?\s*([\d,]+\.?\d*)", text, re.IGNORECASE)
    if amount_match:
        amount = float(amount_match.group(1).replace(",", ""))

    # Extract invoice date
    invoice_date = datetime.utcnow().date().isoformat()
    date_match = re.search(r"(?:Invoice\s*Date|Date)[:\s]*(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{1,2}\s+\w+\s+\d{4})", text, re.IGNORECASE)
    if date_match:
        date_str = date_match.group(1).strip()
        try:
            if "/" in date_str:
                invoice_date = datetime.strptime(date_str, "%m/%d/%Y").date().isoformat()
            elif "-" in date_str and len(date_str) == 10:
                invoice_date = datetime.strptime(date_str, "%Y-%m-%d").date().isoformat()
            else:
                invoice_date = datetime.strptime(date_str, "%d %B %Y").date().isoformat()
        except ValueError:
            pass

    # Extract due date
    due_date = (datetime.utcnow() + timedelta(days=30)).date().isoformat()
    due_match = re.search(r"(?:Due\s*Date|Payment\s*Due)[:\s]*(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{1,2}\s+\w+\s+\d{4})", text, re.IGNORECASE)
    if due_match:
        due_str = due_match.group(1).strip()
        try:
            if "/" in due_str:
                due_date = datetime.strptime(due_str, "%m/%d/%Y").date().isoformat()
            elif "-" in due_str and len(due_str) == 10:
                due_date = datetime.strptime(due_str, "%Y-%m-%d").date().isoformat()
            else:
                due_date = datetime.strptime(due_str, "%d %B %Y").date().isoformat()
        except ValueError:
            pass

    # Extract description
    description = ""
    desc_match = re.search(r"(?:Description|Details|Notes)[:\s]*([^\n]+)", text, re.IGNORECASE)
    if desc_match:
        description = desc_match.group(1).strip()

    return {
        "vendor": vendor,
        "amount": amount,
        "invoice_date": invoice_date,
        "due_date": due_date,
        "invoice_number": invoice_number,
        "description": description,
    }