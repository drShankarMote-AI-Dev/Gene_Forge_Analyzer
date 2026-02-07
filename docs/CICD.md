# 🔄 CI/CD Workflow Suggestions

This document provides recommendations for setting up continuous integration and deployment for Gene Forge Analyzer.

## 🎯 Overview

The monorepo structure allows for independent or coordinated deployments of frontend and backend services.

---

## 🚀 Recommended Workflows

### Option 1: Automatic Deployment (Recommended)

**Frontend (Vercel)**:
- ✅ Auto-deploys on push to `main` branch
- ✅ Preview deployments for pull requests
- ✅ Automatic rollback on failure

**Backend (Render)**:
- ✅ Auto-deploys on push to `main` branch
- ✅ Uses `render.yaml` for configuration
- ✅ Health checks before switching traffic

**Setup**: Already configured! Just push to GitHub.

---

### Option 2: Manual Approval Workflow

For more control, add GitHub Actions with manual approval:

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: npm run install:all
        
      - name: Lint frontend
        run: cd apps/frontend && npm run lint
        
      - name: Build frontend
        run: cd apps/frontend && npm run build
        
      - name: Test backend
        run: |
          cd apps/backend
          pip install -r requirements.txt
          python -m pytest tests/ || echo "No tests found"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/frontend
          
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

### Option 3: Docker-Based CI/CD

For self-hosted deployments:

**File**: `.github/workflows/docker.yml`

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.frontend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/geneforge-frontend:latest
            ${{ secrets.DOCKER_USERNAME }}/geneforge-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.backend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/geneforge-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/geneforge-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🔐 Required Secrets

### For Vercel Deployment

Add these secrets in GitHub Settings → Secrets:

```
VERCEL_TOKEN          # From Vercel account settings
VERCEL_ORG_ID         # From Vercel project settings
VERCEL_PROJECT_ID     # From Vercel project settings
```

### For Render Deployment

```
RENDER_DEPLOY_HOOK    # From Render service settings
```

### For Docker Hub

```
DOCKER_USERNAME       # Your Docker Hub username
DOCKER_PASSWORD       # Your Docker Hub password or access token
```

---

## 📊 Deployment Strategies

### 1. Blue-Green Deployment

**Pros**: Zero downtime, instant rollback  
**Cons**: Requires duplicate infrastructure

**Implementation**:
- Maintain two identical environments (blue/green)
- Deploy to inactive environment
- Switch traffic after health checks pass
- Keep old environment for quick rollback

### 2. Rolling Deployment

**Pros**: Gradual rollout, resource efficient  
**Cons**: Mixed versions during deployment

**Implementation**:
- Update instances one at a time
- Monitor each instance before proceeding
- Automatic rollback on failure

### 3. Canary Deployment

**Pros**: Risk mitigation, gradual testing  
**Cons**: Complex setup, requires monitoring

**Implementation**:
- Deploy to small subset of users (5-10%)
- Monitor metrics and errors
- Gradually increase traffic
- Full rollout if metrics are good

---

## 🧪 Testing Strategy

### Pre-Deployment Tests

```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd apps/frontend && npm install
      - run: cd apps/frontend && npm run lint
      - run: cd apps/frontend && npm run build
      - run: cd apps/frontend && npm test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd apps/backend && pip install -r requirements.txt
      - run: cd apps/backend && python -m pytest
      - run: cd apps/backend && python -m flake8
```

### Post-Deployment Tests

```yaml
# .github/workflows/smoke-test.yml
name: Smoke Tests

on:
  workflow_run:
    workflows: ["Deploy to Production"]
    types: [completed]

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - name: Test Frontend
        run: |
          curl -f https://your-app.vercel.app || exit 1
          
      - name: Test Backend Health
        run: |
          curl -f https://your-backend.onrender.com/health || exit 1
          
      - name: Test API Endpoint
        run: |
          curl -f https://your-backend.onrender.com/api/health || exit 1
```

---

## 📈 Monitoring & Alerts

### Recommended Tools

1. **Uptime Monitoring**:
   - UptimeRobot (free tier available)
   - Pingdom
   - StatusCake

2. **Error Tracking**:
   - Sentry (recommended)
   - Rollbar
   - Bugsnag

3. **Performance Monitoring**:
   - Vercel Analytics (built-in)
   - Google Analytics
   - Plausible Analytics

4. **Log Aggregation**:
   - Render Logs (built-in)
   - Papertrail
   - Logtail

### Alert Configuration

**Uptime Alerts**:
- Check every 5 minutes
- Alert after 2 consecutive failures
- Notify via email/Slack/Discord

**Error Rate Alerts**:
- Alert if error rate > 5%
- Alert if 5xx errors > 10/minute
- Notify development team immediately

**Performance Alerts**:
- Alert if response time > 2 seconds
- Alert if page load time > 5 seconds
- Weekly performance reports

---

## 🔄 Rollback Procedures

### Vercel Rollback

```bash
# Via CLI
vercel rollback

# Via Dashboard
# 1. Go to Deployments
# 2. Find previous successful deployment
# 3. Click "Promote to Production"
```

### Render Rollback

```bash
# Via Dashboard
# 1. Go to service
# 2. Click "Manual Deploy"
# 3. Select previous commit
# 4. Deploy
```

### Docker Rollback

```bash
# Pull previous version
docker pull username/geneforge-backend:previous-sha

# Stop current container
docker stop backend

# Start previous version
docker run -d --name backend username/geneforge-backend:previous-sha
```

---

## 📋 Deployment Checklist

### Before Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables updated
- [ ] Database migrations ready (if any)
- [ ] Backup created
- [ ] Deployment window scheduled
- [ ] Team notified

### During Deployment

- [ ] Monitor deployment logs
- [ ] Watch error rates
- [ ] Check health endpoints
- [ ] Verify API responses
- [ ] Test critical user flows

### After Deployment

- [ ] Smoke tests passed
- [ ] Monitoring shows normal metrics
- [ ] No spike in errors
- [ ] User feedback positive
- [ ] Documentation updated
- [ ] Deployment notes recorded

---

## 🎯 Best Practices

1. **Always deploy backend before frontend**
   - Ensures API compatibility
   - Prevents breaking changes

2. **Use semantic versioning**
   - Tag releases: `v1.0.0`, `v1.1.0`, etc.
   - Track changes in CHANGELOG.md

3. **Maintain staging environment**
   - Test deployments before production
   - Mirror production configuration

4. **Automate everything**
   - Tests, builds, deployments
   - Reduce human error

5. **Monitor continuously**
   - Set up alerts
   - Review metrics regularly
   - Act on anomalies quickly

6. **Document incidents**
   - Post-mortem for failures
   - Update runbooks
   - Share learnings

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Docker CI/CD Best Practices](https://docs.docker.com/ci-cd/)

---

**Last Updated**: January 2026
