# Use Python 3.11 slim as base
FROM python:3.11-slim

# Create a non-root user
RUN groupadd -r geneforge && useradd -r -g geneforge geneforge

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    APP_HOME=/app

# Set work directory
WORKDIR $APP_HOME

# Install system dependencies and clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set ownership to non-root user
RUN chown -R geneforge:geneforge $APP_HOME

# Switch to non-root user
USER geneforge

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run the application
# Use gunicorn for production. Gunicorn will bind to $PORT provided by Render.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --worker-class eventlet --workers 1 --timeout 120 app:app"]

