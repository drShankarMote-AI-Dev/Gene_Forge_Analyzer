# Render Deployment Fix Guide

## ⚠️ Current Issue

Your Render service is trying to run:
- Build: `npm install; npm run build` (builds frontend)
- Start: `npm run dev` (Windows-specific dev mode)

This fails because:
1. The root `package.json` has Windows PowerShell syntax
2. Render runs on Linux and can't execute Windows commands
3. You're trying to run dev mode in production

---

## ✅ Solution: Choose Your Deployment Strategy

### Option 1: Full-Stack Docker (Recommended - Simplest)

**Deploy frontend + backend together in one container.**

#### Setup

1. **Go to Render Dashboard** → Delete current service

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure**:
   ```
   Name: gene-forge-fullstack
   Environment: Docker
   Dockerfile Path: ./Dockerfile
   Docker Context: .
   ```

4. **Add Environment Variables**:
   ```env
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   FRONTEND_URL=https://your-app.onrender.com
   ALLOWED_ORIGINS=https://your-app.onrender.com
   NODE_ENV=production
   FLASK_ENV=production
   ```

5. **Deploy** and wait for build

#### Access
- Frontend: `https://your-app.onrender.com/`
- Backend API: `https://your-app.onrender.com/api/...`
- Health: `https://your-app.onrender.com/health`

#### Pros
- ✅ Simplest setup (one service)
- ✅ No CORS issues
- ✅ Single URL
- ✅ Cost-effective

---

### Option 2: Backend-Only (For Vercel Frontend)

**Deploy only the backend API to Render.**

#### Setup

1. **Go to Render Dashboard** → Delete current service

2. **Create New Web Service**

3. **Configure**:
   ```
   Name: gene-forge-backend
   Root Directory: apps/backend
   Environment: Docker
   Dockerfile Path: apps/backend/Dockerfile
   Docker Context: apps/backend
   ```

4. **Add Environment Variables**:
   ```env
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://gene-forge-analyzer.vercel.app
   NODE_ENV=production
   FLASK_ENV=production
   ```

5. **Deploy**

6. **Deploy Frontend to Vercel**:
   - Root Directory: `apps/frontend`
   - Add env var: `VITE_API_URL=https://your-backend.onrender.com`

#### Pros
- ✅ Best performance (Vercel CDN)
- ✅ Separate scaling
- ✅ Free tier on both platforms

---

### Option 3: Using render.yaml (Automatic)

**Let Render auto-configure from the blueprint.**

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render detects `render.yaml` automatically

3. **Choose deployment type**:
   - Edit `render.yaml` to uncomment your preferred option
   - Full-stack or backend-only

4. **Add environment variables** in Render UI

5. **Click "Apply"**

---

## 🧪 Verification

### Test Health Endpoint
```bash
curl https://your-app.onrender.com/health
```

Expected:
```json
{
  "service": "gene-forge-backend",
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### Test Root Endpoint
```bash
curl https://your-app.onrender.com/
```

Expected:
```json
{
  "msg": "Welcome to Gene Forge API",
  "status": "online",
  "version": "1.0.0"
}
```

---

## 🐛 Why Did This Happen?

The root `package.json` contains Windows-specific syntax:
```json
"predev": "npm run clean:ports && (if not exist node_modules ...)"
```

This command:
- ✅ Works on Windows PowerShell
- ❌ Fails on Linux (Render's environment)

**Solution**: Use Docker deployment (Options 1 or 2) which doesn't rely on npm scripts.

---

## 📚 More Information

See `DEPLOYMENT_OPTIONS.md` for:
- Detailed comparison of all deployment strategies
- Platform-specific guides
- Environment variable reference
- Troubleshooting tips

---

## 🎯 Recommended: Option 1 (Full-Stack Docker)

For most users, deploying the full stack to Render is the simplest and most cost-effective solution.
