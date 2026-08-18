FROM python:3.11-slim

# Set working directory for execution
WORKDIR /app

# Copy dependency mappings first to leverage Docker build caching
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app files directly into the root of /app
COPY backend/app/ ./

# Expose the target port App Runner expects
EXPOSE 8000

# Start command - App Runner will set PORT env var, but we default to 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]