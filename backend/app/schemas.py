from datetime import date
from typing import List, Optional

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool

    model_config = {
        "from_attributes": True,
    }

class ParsedInvoice(BaseModel):
    vendor: str
    total: float
    invoiceDate: str
    dueDate: str
    paymentTerms: str
    confidence: float
    lineItems: List[str]

class UploadResponse(BaseModel):
    status: str
    invoice_number: str
    file_name: str
    content_type: str
    recommendation: str
    parsed_invoice: ParsedInvoice
