FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Install only production dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend app code
COPY backend/app ./app

# Set working directory for execution
WORKDIR /app

# Expose the port App Runner expects
EXPOSE 8000

# Start command - App Runner will set PORT env var, but we default to 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]