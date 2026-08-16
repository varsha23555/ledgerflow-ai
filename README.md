# LedgerFlow AI

LedgerFlow AI is a full-stack prototype for an intelligent cash flow visibility platform tailored to small businesses, agency founders, fractional CFOs, bookkeepers, and startup leaders.

## What it includes

- Next.js + Tailwind frontend for dashboards, upload workflows, and alert summaries.
- FastAPI backend with REST endpoints for invoice/bank matching, forecasting, and liquidity recommendations.
- PostgreSQL with `pgvector` for semantic matching and embedded invoice/bank transaction vectors.
- Redis + Celery for asynchronous forecast generation and alert scanning.
- AI integration scaffolding for OpenAI / Claude + Prophet / XGBoost predictive models.

## Startup

1. Copy `.env.example` to `.env` and configure secrets.
2. Install frontend dependencies:
   ```powershell
   cd ledgerflow-ai\frontend
   npm install
   ```
3. Install backend dependencies:
   ```powershell
   cd ledgerflow-ai\backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
4. Run the backend:
   ```powershell
   cd ledgerflow-ai\backend
   .\.venv\Scripts\Activate.ps1
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. Run the frontend:
   ```powershell
   cd ledgerflow-ai\frontend
   npm run dev
   ```
6. Visit:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000/api/health`

## Folder layout

- `frontend/` — Next.js UI, Tailwind styling, and API client.
- `backend/` — FastAPI app, Celery tasks, SQLAlchemy models, and AI services.
- `infra/` — database initialization SQL and compose wiring.

## Notes

- The AI integration is scaffolded for real OpenAI / Anthropic keys, but includes safe local fallback behavior for development.
- Forecasting uses Prophet and XGBoost with a realistic 30/60/90-day cashflow model.
- The backend now includes SQLite/SQLAlchemy database models and JWT authentication for login/register.
- Frontend includes mobile responsive layout, form validation, and protected routes.

