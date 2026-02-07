# 🐳 Docker Deployment Guide

Complete guide for containerizing and deploying Gene Forge Analyzer with Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Dockerfiles](#available-dockerfiles)
- [Docker Compose](#docker-compose)
- [Individual Containers](#individual-containers)
- [Environment Variables](#environment-variables)
- [Production Best Practices](#production-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Overview

Gene Forge Analyzer provides multiple Docker configurations for different deployment scenarios:

```
Gene_Forge_Analyzer/
├── Dockerfile                 # Unified fullstack (frontend + backend)
├── Dockerfile.frontend        # Frontend only (React + Nginx)
├── Dockerfile.backend         # Backend only (Flask + Gunicorn)
├── Dockerfile.fullstack       # Alternative fullstack with nginx proxy
├── docker-compose.yml         # Orchestration for local development
├── nginx.conf                 # Nginx config for frontend
└── nginx-fullstack.conf       # Nginx config for fullstack
```

---

## 📦 Available Dockerfiles

### 1. Dockerfile.frontend

**Purpose**: Serves the React/Vite frontend with Nginx  
**Ports**: 80  
**Size**: ~50MB (Alpine-based)

**Build**:
```bash
docker build -f Dockerfile.frontend -t geneforge-frontend .
```

**Run**:
```bash
docker run -d -p 3000:80 --name frontend geneforge-frontend
```

**Use Case**: Static hosting, CDN deployment, frontend-only services

---

### 2. Dockerfile.backend

**Purpose**: Runs Flask API with Gunicorn  
**Ports**: 5000  
**Workers**: 4 (configurable)

**Build**:
```bash
docker build -f Dockerfile.backend -t geneforge-backend .
```

**Run**:
```bash
docker run -d -p 5000:5000 \
  -e DATABASE_URL=sqlite:///geneforge.db \
  -e SECRET_KEY=your-secret-key \
  -e JWT_SECRET_KEY=your-jwt-secret \
  -e FRONTEND_URL=http://localhost:3000 \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  --name backend \
  geneforge-backend
```

**Use Case**: Microservices, API-only deployment, backend scaling

---

### 3. Dockerfile.fullstack

**Purpose**: Combined frontend + backend in single container  
**Ports**: 80 (Nginx), 5000 (Flask)  
**Components**: Nginx + Gunicorn

**Build**:
```bash
docker build -f Dockerfile.fullstack -t geneforge-fullstack .
```

**Run**:
```bash
docker run -d -p 80:80 -p 5000:5000 \
  -e DATABASE_URL=sqlite:///geneforge.db \
  -e SECRET_KEY=your-secret \
  --name fullstack \
  geneforge-fullstack
```

**Use Case**: Single-server deployment, simplified hosting

---

### 4. Dockerfile (Unified)

**Purpose**: Production-ready fullstack with frontend build  
**Ports**: 5000  
**Components**: Flask serves both API and static frontend

**Build**:
```bash
docker build -t geneforge-production .
```

**Run**:
```bash
docker run -d -p 5000:5000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e SECRET_KEY=$SECRET_KEY \
  -e JWT_SECRET_KEY=$JWT_SECRET_KEY \
  -e FRONTEND_URL=$FRONTEND_URL \
  --name production \
  geneforge-production
```

**Use Case**: Railway, Render, Heroku, single-container platforms

---

## 🎼 Docker Compose

### Development Setup

The `docker-compose.yml` orchestrates both frontend and backend services.

**Start**:
```bash
docker-compose up --build
```

**Start in background**:
```bash
docker-compose up -d
```

**View logs**:
```bash
docker-compose logs -f
```

**Stop**:
```bash
docker-compose down
```

**Clean up (including volumes)**:
```bash
docker-compose down -v
```

### Services

#### Backend Service
- **Container**: `geneforge-backend`
- **Port**: 5000
- **Health Check**: `http://localhost:5000/health`
- **Volume**: `./apps/backend:/app` (for hot reload)

#### Frontend Service
- **Container**: `geneforge-frontend`
- **Port**: 3000
- **Depends On**: backend (waits for health check)
- **Volume**: `./apps/frontend:/app` (for hot reload)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
DATABASE_URL=sqlite:///geneforge.db
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=jwt-dev-secret
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
NODE_ENV=development
FLASK_ENV=development

# Optional: AI & Auth
OPENAI_API_KEY=
GEMINI_API_KEY=
EMAIL_USERNAME=
EMAIL_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Docker Compose will automatically load these variables.

---

## 🔧 Individual Containers

### Frontend Container

```bash
# Build
docker build -f Dockerfile.frontend -t geneforge-frontend .

# Run
docker run -d \
  -p 3000:80 \
  --name frontend \
  geneforge-frontend

# View logs
docker logs -f frontend

# Stop
docker stop frontend
docker rm frontend
```

### Backend Container

```bash
# Build
docker build -f Dockerfile.backend -t geneforge-backend .

# Run with environment variables
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL=sqlite:///geneforge.db \
  -e SECRET_KEY=$(openssl rand -hex 32) \
  -e JWT_SECRET_KEY=$(openssl rand -hex 32) \
  -e FRONTEND_URL=http://localhost:3000 \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  -e OPENAI_API_KEY=your-key \
  --name backend \
  geneforge-backend

# View logs
docker logs -f backend

# Execute commands inside container
docker exec -it backend python admin.py list

# Stop
docker stop backend
docker rm backend
```

### Networking Between Containers

Create a custom network for frontend-backend communication:

```bash
# Create network
docker network create geneforge-network

# Run backend
docker run -d \
  --network geneforge-network \
  --name backend \
  -p 5000:5000 \
  -e DATABASE_URL=sqlite:///geneforge.db \
  -e SECRET_KEY=secret \
  -e JWT_SECRET_KEY=jwt-secret \
  -e FRONTEND_URL=http://frontend \
  geneforge-backend

# Run frontend
docker run -d \
  --network geneforge-network \
  --name frontend \
  -p 3000:80 \
  geneforge-frontend
```

Now frontend can access backend at `http://backend:5000`.

---

## 🌍 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///geneforge.db` |
| `SECRET_KEY` | Flask session secret | `openssl rand -hex 32` |
| `JWT_SECRET_KEY` | JWT signing key | `openssl rand -hex 32` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | `5000` |
| `FLASK_ENV` | Flask environment | `production` |
| `NODE_ENV` | Node environment | `production` |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `GEMINI_API_KEY` | Google Gemini key | - |
| `EMAIL_USERNAME` | SMTP email | - |
| `EMAIL_PASSWORD` | SMTP password | - |

---

## 🔒 Production Best Practices

### 1. Use Multi-Stage Builds

All Dockerfiles use multi-stage builds to minimize image size:
- Frontend: ~50MB (Alpine + Nginx)
- Backend: ~200MB (Python slim)

### 2. Health Checks

All containers include health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:5000/health || exit 1
```

### 3. Non-Root User

For production, run containers as non-root:

```dockerfile
RUN adduser -D appuser
USER appuser
```

### 4. Secrets Management

**Never hardcode secrets**. Use:
- Docker secrets
- Environment variables from CI/CD
- Secret management tools (Vault, AWS Secrets Manager)

```bash
# Using Docker secrets
echo "my-secret-key" | docker secret create secret_key -
docker service create --secret secret_key geneforge-backend
```

### 5. Volume Persistence

For production databases, use named volumes:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

### 6. Resource Limits

Set memory and CPU limits:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 7. Logging

Configure structured logging:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 🐛 Troubleshooting

### Container Won't Start

**Check logs**:
```bash
docker logs <container-name>
```

**Inspect container**:
```bash
docker inspect <container-name>
```

### Port Already in Use

**Find process using port**:
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

**Kill process or use different port**:
```bash
docker run -p 5001:5000 geneforge-backend
```

### Database Connection Errors

**Check DATABASE_URL format**:
```bash
# SQLite (relative path)
DATABASE_URL=sqlite:///geneforge.db

# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/db
```

**Verify database file exists**:
```bash
docker exec -it backend ls -la /app
```

### CORS Errors

**Ensure ALLOWED_ORIGINS matches frontend URL**:
```bash
docker run -e ALLOWED_ORIGINS=http://localhost:3000 geneforge-backend
```

### Build Failures

**Clear Docker cache**:
```bash
docker system prune -a
docker-compose build --no-cache
```

**Check disk space**:
```bash
docker system df
```

### Container Exits Immediately

**Run interactively to debug**:
```bash
docker run -it geneforge-backend /bin/bash
```

**Check entrypoint/command**:
```bash
docker inspect geneforge-backend | grep -A 5 Cmd
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

**Last Updated**: January 2026
