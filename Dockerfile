# ================================
# Multi-Stage Production Dockerfile
# Gene Forge Analyzer v2.0.0
# ================================

# ============================================
# Stage 1: Frontend Build
# ============================================
FROM node:20-alpine AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Install dependencies (including devDependencies for build)
COPY apps/frontend/package*.json ./
RUN npm install

# Copy source and build
COPY apps/frontend/ ./
RUN npm run build

# ============================================
# Stage 2: Backend Dependencies
# ============================================
FROM python:3.11-slim AS backend-deps

# Set working directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY apps/backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM python:3.11-slim AS production

# Create non-root user for security
RUN groupadd -r geneforge && useradd -r -g geneforge geneforge

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    PORT=5000 \
    APP_HOME=/app

# Set working directory
WORKDIR $APP_HOME

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=backend-deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-deps /usr/local/bin /usr/local/bin

# Copy backend source
COPY apps/backend/ ./apps/backend/

# Copy frontend build artifacts
COPY --from=frontend-builder /app/frontend/dist ./apps/frontend/dist

# Create necessary directories and set permissions
RUN mkdir -p ./apps/backend/instance ./apps/backend/logs && \
    chown -R geneforge:geneforge $APP_HOME

# Switch to non-root user
USER geneforge

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Set working directory to backend
WORKDIR $APP_HOME/apps/backend

# Run application with gunicorn
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --worker-class eventlet --workers 1 --timeout 120 --access-logfile - --error-logfile - app:app"]
