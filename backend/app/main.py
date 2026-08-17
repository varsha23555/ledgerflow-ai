import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, status
from .routes import invoice, forecast, health, auth, dashboard
from .db import init_db

app = FastAPI(title="LedgerFlow AI", version="0.1.0")

# Serve React static files from the build directory
build_dir = os.getenv("REACT_BUILD_DIR", "/app/build")
if os.path.isdir(build_dir):
    app.mount("/static", StaticFiles(directory=build_dir), name="static")
    # Add catch-all route to serve index.html for SPA routing
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        index_file = os.path.join(build_dir, "index.html")
        if os.path.isdir(build_dir) and os.path.isfile(index_file):
            from fastapi.responses import FileResponse
            return FileResponse(index_file)
    
    # Return a clean 200 OK text message so AWS health checks pass if they hit "/"
        return {"status": "backend_running", "message": "React frontend build not found"}
else:
    # If no build dir, just proceed with API routes
    pass

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health, prefix="/api")
app.include_router(invoice, prefix="/api")
app.include_router(forecast, prefix="/api")
app.include_router(auth, prefix="/api")
app.include_router(dashboard, prefix="/api")

@app.on_event("startup")
async def startup_event():
    await init_db()