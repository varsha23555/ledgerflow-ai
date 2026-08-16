from datetime import datetime
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, default="Business User")
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    clients = relationship("Client", back_populates="owner")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(255), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="clients")
    invoices = relationship("Invoice", back_populates="client")
    bank_transactions = relationship("BankTransaction", back_populates="client")
    alerts = relationship("Alert", back_populates="client")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    invoice_number = Column(String(128), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    invoice_date = Column(Date, nullable=False)
    status = Column(String(64), nullable=False, default="pending")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="invoices")

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    transaction_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="bank_transactions")

class Forecast(Base):
    __tablename__ = "cashflow_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    horizon_days = Column(Integer, nullable=False)
    forecast_json = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    alert_type = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(64), nullable=False)
    payload = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="alerts")
