import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import invoice, forecast, health, auth, dashboard
from .db import init_db

app = FastAPI(title="LedgerFlow AI", version="0.1.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(health, prefix="/api")
app.include_router(invoice, prefix="/api")
app.include_router(forecast, prefix="/api")
app.include_router(auth, prefix="/api")
app.include_router(dashboard, prefix="/api")

@app.on_event("startup")
async def startup_event():
    await init_db()
