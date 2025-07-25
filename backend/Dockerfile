# Multi-stage build for production-ready FastAPI application
FROM python:3.11-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

# Install dependencies stage
FROM base AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /root/.local /root/.local
COPY . .

# Production stage
FROM base AS production
WORKDIR /app

# Copy Python packages
COPY --from=deps /root/.local /root/.local

# Copy application code
COPY --from=builder /app/main.py .
COPY --from=builder /app/config.py .
COPY --from=builder /app/database.py .
COPY --from=builder /app/models.py .
COPY --from=builder /app/api ./api

# Create logs directory
RUN mkdir -p /app/logs && chown -R app:app /app

# Switch to non-root user
USER app

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV PATH=/root/.local/bin:$PATH

# Health check (curl is available from base image)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Start the application with proper logging
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"] 