# 🚀 Deployment Options Guide

This project supports **multiple deployment strategies** to fit different needs and platforms.

---

## 📋 Deployment Strategy Matrix

| Strategy | Frontend | Backend | Best For | Complexity |
|----------|----------|---------|----------|------------|
| **Full-Stack Docker** | Render | Render (same container) | Single platform, simple setup | ⭐ Easy |
| **Split Deployment** | Vercel | Render | Best performance, CDN for frontend | ⭐⭐ Medium |
| **All Docker** | Render/Railway | Render/Railway (separate) | Full control, microservices | ⭐⭐⭐ Advanced |

---

## 🎯 Option 1: Full-Stack Docker (Recommended for Render)

**Deploy the entire application in one container to Render.**

### Why Use This?
- ✅ Simplest deployment (one service)
- ✅ Frontend and backend in same container
- ✅ No CORS configuration needed
- ✅ Single URL for everything
- ✅ Cost-effective (one service)

### How to Deploy

#### Using render.yaml (Automatic)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - https://dashboard.render.com/

3. **Create New Web Service**:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` automatically

4. **Add Environment Variables** in Render Dashboard:
   ```env
   DATABASE_URL=postgresql://user:pass@host/db
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-here
   FRONTEND_URL=https://your-app.onrender.com
   ALLOWED_ORIGINS=https://your-app.onrender.com
   ```

5. **Deploy**:
   - Click "Apply"
   - Wait for build to complete

#### Manual Setup

1. **Create New Web Service** on Render

2. **Configure**:
   ```
   Name: gene-forge-fullstack
   Environment: Docker
   Dockerfile Path: ./Dockerfile
   Docker Context: .
   ```

3. **Add Environment Variables** (same as above)

4. **Deploy**

### Access Your App
- **Frontend**: `https://your-app.onrender.com/`
- **Backend API**: `https://your-app.onrender.com/api/...`
- **Health Check**: `https://your-app.onrender.com/health`

---

## 🌐 Option 2: Split Deployment (Vercel + Render)

**Frontend on Vercel (CDN), Backend on Render (API).**

### Why Use This?
- ✅ Best performance (Vercel's global CDN)
- ✅ Automatic HTTPS and SSL
- ✅ Separate scaling for frontend/backend
- ✅ Free tier for both platforms

### Frontend: Vercel

1. **Go to Vercel Dashboard**:
   - https://vercel.com/dashboard

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import from GitHub

3. **Configure**:
   ```
   Root Directory: apps/frontend
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend.onrender.com
   VITE_APP_NAME=Gene Forge Analyzer
   ```

5. **Deploy**

### Backend: Render

1. **Create New Web Service** on Render

2. **Configure**:
   ```
   Root Directory: apps/backend
   Environment: Docker
   Dockerfile Path: apps/backend/Dockerfile
   ```

3. **Add Environment Variables**:
   ```env
   DATABASE_URL=postgresql://...
   SECRET_KEY=...
   JWT_SECRET_KEY=...
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

4. **Deploy**

### Update Frontend
After backend deploys, update Vercel's `VITE_API_URL` to your Render backend URL.

---

## 🐳 Option 3: Docker Compose (Local/Self-Hosted)

**Run the entire stack locally or on your own server.**

### Local Development

```bash
# Start everything
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Production Self-Hosted

1. **Set up your server** (Ubuntu, DigitalOcean, AWS, etc.)

2. **Install Docker & Docker Compose**

3. **Clone repository**:
   ```bash
   git clone https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer.git
   cd Gene_Forge_Analyzer
   ```

4. **Create production docker-compose**:
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "80:5000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - SECRET_KEY=${SECRET_KEY}
         # ... other vars
       restart: unless-stopped
   ```

5. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## 🚂 Option 4: Railway (Alternative to Render)

**Similar to Render, supports Docker and auto-deployment.**

### Full-Stack on Railway

1. **Go to Railway**: https://railway.app/

2. **New Project** → **Deploy from GitHub**

3. **Configure**:
   - Dockerfile: `./Dockerfile`
   - Root Directory: `.`

4. **Add Environment Variables** (same as Render)

5. **Deploy**

### Backend-Only on Railway

1. **New Project** → **Deploy from GitHub**

2. **Configure**:
   - Dockerfile: `./apps/backend/Dockerfile`
   - Root Directory: `./apps/backend`

3. **Add Environment Variables**

4. **Deploy**

---

## 📊 Platform Comparison

| Platform | Free Tier | Auto-Deploy | Docker Support | Best For |
|----------|-----------|-------------|----------------|----------|
| **Render** | ✅ 750hrs/mo | ✅ Yes | ✅ Yes | Full-stack, Backend |
| **Vercel** | ✅ Generous | ✅ Yes | ❌ No | Frontend only |
| **Railway** | ✅ $5 credit | ✅ Yes | ✅ Yes | Full-stack, Backend |
| **Fly.io** | ✅ Limited | ✅ Yes | ✅ Yes | Global deployment |
| **DigitalOcean** | ❌ Paid | ⚠️ Manual | ✅ Yes | Self-hosted |

---

## 🔧 Environment Variables Reference

### Required (All Deployments)
```env
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=minimum-32-character-random-string
JWT_SECRET_KEY=another-32-character-random-string
```

### CORS Configuration
```env
# Full-Stack (same domain)
FRONTEND_URL=https://your-app.onrender.com
ALLOWED_ORIGINS=https://your-app.onrender.com

# Split Deployment (different domains)
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,https://gene-forge-analyzer.vercel.app
```

### Optional Features
```env
# AI Features
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Email/OTP
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🧪 Testing Your Deployment

### Health Check
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

### Frontend Access
- Open `https://your-app.onrender.com/` (full-stack)
- Or `https://your-app.vercel.app/` (split deployment)

### API Test
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

## 🆘 Troubleshooting

### Build Fails on Render
- Check Dockerfile path is correct
- Verify all dependencies are in requirements.txt
- Check Render build logs for specific errors

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check Render logs for incoming Origin headers
- Ensure no trailing slashes in URLs

### Database Connection Fails
- Verify `DATABASE_URL` format: `postgresql://` not `postgres://`
- Check database is accessible from Render
- Test connection from Render shell

### Frontend Can't Reach Backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Test backend health endpoint directly
- Check for CORS errors in browser console

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com

---

## 🎯 Recommended Setup

**For Most Users**: Option 1 (Full-Stack Docker on Render)
- Simplest setup
- One service to manage
- No CORS complexity

**For Best Performance**: Option 2 (Vercel + Render)
- Global CDN for frontend
- Optimized for production
- Separate scaling

**For Learning/Development**: Option 3 (Docker Compose)
- Full control
- Easy local testing
- No platform dependencies

---

Choose the option that best fits your needs! All are production-ready and fully supported.
