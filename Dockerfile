FROM python:3.11-slim

# Set working directory for execution
WORKDIR /app

# Copy dependency mappings first to leverage Docker build caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app files directly into the root of /app
COPY app/ ./app/

# Expose the application port
EXPOSE 8000

# Start command - default to port 8000, override with PORT env var if available
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]