# Task: Deploy to Single AWS App Runner

## Goal
Modify the ledgerflow-ai application source code so the frontend and backend can run in a single AWS App Runner service.

## Current State
- Separate App Runner configurations: `apprunner-ledgerflow.json` (frontend) and `apprunner-ledgerflow-backend.json` (backend)
- Frontend: React app served via Vite/React DOM
- Backend: FastAPI application

## Changes Needed

### 1. Backend Modifications ✅ IN PROGRESS
- [x] Modify `main.py` to serve React static files from `/app/build/`
- [ ] Add catch-all route to serve `index.html` for SPA routing
- [ ] Update CORS configuration for App Runner domain
- [ ] Add environment variable for frontend origin

### 2. Frontend Build Configuration ✅ IN PROGRESS
- [x] Ensure Vite builds to a directory accessible by backend
- [ ] Update build output directory if needed

### 3. Single App Runner Configuration ⏳ PENDING
- [ ] Create unified `apprunner-service.json` 
- [ ] Configure single service with both Node.js and Python
- [ ] Set up proper port handling (3000 for React, 8000 for FastAPI)
- [ ] Configure environment variables

### 4. Database Considerations ⏳ PENDING
- [ ] Ensure SQLite works in App Runner environment
- [ ] Update DB path if needed for writable directory

### 5. Testing ⏳ PENDING
- [ ] Verify the combined application works
- [ ] Test API endpoints
- [ ] Test frontend routing

## Progress Tracking