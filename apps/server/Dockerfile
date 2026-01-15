FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for eventlet/socketio if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the API port
EXPOSE 5000

# Metadata for labels
LABEL org.opencontainers.image.title="GeneForge Analysis Engine"
LABEL org.opencontainers.image.description="AI-Powered Genomic Analysis Backend"

# Run with gunicorn and eventlet for production performance
CMD gunicorn -k eventlet -w 1 --bind 0.0.0.0:$PORT app:app
