# Multi-stage build for faster Python builds
FROM python:3.11-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
FROM base AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Build stage
FROM base AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Production stage
FROM python:3.11-slim AS production
WORKDIR /app

# Copy only necessary files
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /app/main.py .
COPY --from=builder /app/models.py .
COPY --from=builder /app/config.py .
COPY --from=builder /app/database.py .
COPY --from=builder /app/api ./api
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/utils ./utils

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 