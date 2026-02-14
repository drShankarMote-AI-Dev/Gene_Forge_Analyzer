# ================================
# Backend Dockerfile (Production)
# Gene Forge Analyzer v2.0.0
# ================================

FROM python:3.11-slim

# Metadata
LABEL maintainer="drShankarMote-AI-Dev"
LABEL version="2.0.0"
LABEL description="Gene Forge Analyzer Backend API"

# Create non-root user
RUN groupadd -r geneforge && useradd -r -g geneforge geneforge

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    APP_HOME=/app \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install build tools
RUN pip install --upgrade pip setuptools wheel

# Copy and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p instance logs && \
    chown -R geneforge:geneforge $APP_HOME

# Switch to non-root user
USER geneforge

# Expose Flask port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run with gunicorn for production
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --worker-class eventlet --workers 1 --timeout 120 --access-logfile - --error-logfile - app:app"]
