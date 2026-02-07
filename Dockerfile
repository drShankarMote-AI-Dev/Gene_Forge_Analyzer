# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY apps/frontend/package*.json ./
RUN npm install
COPY apps/frontend/ .
RUN npm run build

# Stage 2: Production Runtime
FROM python:3.11-slim
RUN groupadd -r geneforge && useradd -r -g geneforge geneforge

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    PORT=5000 \
    APP_HOME=/app

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend deps
COPY apps/backend/requirements.txt ./apps/backend/
RUN pip install --no-cache-dir -r ./apps/backend/requirements.txt

# Copy backend source
COPY apps/backend/ ./apps/backend/
# Copy frontend build artifacts
COPY --from=frontend-builder /app/dist ./apps/frontend/dist

RUN chown -R geneforge:geneforge $APP_HOME
USER geneforge

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/auth/ping || exit 1

WORKDIR $APP_HOME/apps/backend
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --worker-class eventlet --workers 1 --timeout 120 app:app"]

