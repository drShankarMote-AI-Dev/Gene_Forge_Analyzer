# 🐳 Docker Deployment Guide
## Gene Forge Analyzer v2.0.0

This guide provides comprehensive instructions for deploying Gene Forge Analyzer using Docker.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Commands Reference](#docker-commands-reference)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Prerequisites

### Required Software
- **Docker**: v24.0.0 or higher
- **Docker Compose**: v2.20.0 or higher

### Verify Installation
```bash
docker --version
docker-compose --version
```

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Disk Space**: Minimum 5GB free
- **CPU**: 2+ cores recommended

---

## Quick Start

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer.git
cd Gene_Forge_Analyzer

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 2. Build and Run

```bash
# Build containers
npm run docker:build

# Start services
npm run docker:up

# View logs
npm run docker:logs
```

### 3. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

---

## Development Deployment

### Architecture

In development mode, Docker Compose runs two separate containers:
- **Backend**: Flask API on port 5000
- **Frontend**: Nginx serving React build on port 3000

### Build Development Containers

```bash
# Standard build (uses cache)
docker-compose build

# Clean build (no cache)
docker-compose build --no-cache

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Start Development Services

```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up -d backend
```

### Monitor Services

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# Check container status
docker-compose ps
```

### Stop Services

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## Production Deployment

### Single Container Deployment

The root `Dockerfile` creates a unified production image where Flask serves the compiled React frontend.

#### Build Production Image

```bash
# Using npm script
npm run docker:prod:build

# Or directly
docker build -t geneforge-prod:2.0.0 .
```

#### Run Production Container

```bash
# Using npm script
npm run docker:prod:run

# Or directly
docker run -d \
  --name geneforge-production \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  geneforge-prod:2.0.0
```

#### Access Production Application

- **Application**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login
- **API**: http://localhost:5000/api

---

## Docker Commands Reference

### Build Commands

```bash
# Build all services
npm run docker:build

# Build without cache (clean build)
npm run docker:build:no-cache

# Build production image
npm run docker:prod:build
```

### Container Management

```bash
# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# Restart containers
npm run docker:restart

# View container status
npm run docker:ps
```

### Logging

```bash
# View all logs
npm run docker:logs

# View backend logs
npm run docker:logs:backend

# View frontend logs
npm run docker:logs:frontend
```

### Cleanup

```bash
# Remove unused containers/images
npm run docker:clean

# Remove everything (including volumes)
npm run docker:clean:all

# Complete cleanup
npm run clean:all
```

---

## Best Practices

### Security

1. **Never commit `.env` files**
2. **Use strong secrets**
3. **Run as non-root user** (already configured)
4. **Keep images updated**

### Performance

1. **Use multi-stage builds** (already implemented)
2. **Optimize layer caching** (already optimized)
3. **Set resource limits** (configured in docker-compose.yml)
4. **Use volumes for data** (already configured)

---

**Last Updated**: February 13, 2026  
**Version**: 2.0.0
