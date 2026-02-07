# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment of Gene Forge Analyzer.

## 📋 Pre-Deployment

### Local Development Setup
- [ ] Clone repository
- [ ] Run `npm run install:all`
- [ ] Copy `.env.example` files to `.env`
- [ ] Configure environment variables
- [ ] Test local development with `npm run dev`
- [ ] Verify admin login works locally
- [ ] Test all major features locally

### Code Quality
- [ ] Run `npm run lint` and fix any errors
- [ ] Run `npm test` and ensure all tests pass
- [ ] Review and commit all changes
- [ ] Push to GitHub

---

## 🔐 API Keys & Credentials

### Google OAuth (Optional)
- [ ] Create project in [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [ ] Add authorized redirect URIs:
  - [ ] `http://localhost:5173/auth/callback` (local)
  - [ ] `https://your-app.vercel.app/auth/callback` (production)

### OpenAI API (Optional)
- [ ] Sign up at [OpenAI Platform](https://platform.openai.com/)
- [ ] Generate API key
- [ ] Copy `OPENAI_API_KEY`

### Google Gemini API (Optional)
- [ ] Sign up at [Google AI Studio](https://aistudio.google.com/)
- [ ] Generate API key
- [ ] Copy `GEMINI_API_KEY`

### Email SMTP (Optional)
- [ ] Use Gmail or other SMTP provider
- [ ] For Gmail: Generate App Password at [Google Account](https://myaccount.google.com/apppasswords)
- [ ] Copy `EMAIL_USERNAME` and `EMAIL_PASSWORD`

---

## ☁️ Backend Deployment (Render)

### 1. Create Render Account
- [ ] Sign up at [Render](https://render.com)
- [ ] Connect GitHub account

### 2. Deploy Backend

#### Option A: Using Blueprint (Recommended)
- [ ] Push `render.yaml` to GitHub
- [ ] In Render Dashboard: New → Blueprint
- [ ] Select repository
- [ ] Render auto-detects `render.yaml`
- [ ] Click "Apply"

#### Option B: Manual Web Service
- [ ] In Render Dashboard: New → Web Service
- [ ] Connect repository
- [ ] Configure:
  - **Name**: `gene-forge-backend`
  - **Root Directory**: `apps/backend`
  - **Environment**: Python 3
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `gunicorn app:app --workers=4 --bind=0.0.0.0:$PORT --timeout=120`

### 3. Set Environment Variables

In Render Dashboard → Service → Environment:

**Required**:
- [ ] `SECRET_KEY` = (auto-generate or use `openssl rand -hex 32`)
- [ ] `JWT_SECRET_KEY` = (auto-generate or use `openssl rand -hex 32`)
- [ ] `DATABASE_URL` = `sqlite:///geneforge.db` (or PostgreSQL URL)
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] `ALLOWED_ORIGINS` = `https://your-app.vercel.app`
- [ ] `JWT_COOKIE_SECURE` = `True`
- [ ] `JWT_COOKIE_SAMESITE` = `None`
- [ ] `NODE_ENV` = `production`
- [ ] `FLASK_ENV` = `production`

**Optional**:
- [ ] `OPENAI_API_KEY` = (your key)
- [ ] `GEMINI_API_KEY` = (your key)
- [ ] `EMAIL_USERNAME` = (your email)
- [ ] `EMAIL_PASSWORD` = (your app password)
- [ ] `GOOGLE_CLIENT_ID` = (your client ID)
- [ ] `GOOGLE_CLIENT_SECRET` = (your client secret)

### 4. Verify Backend
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://gene-forge-analyzer-ld7t.onrender.com`)
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`
- [ ] Should return: `{"status": "ok", ...}`

---

## 🌐 Frontend Deployment (Vercel)

### 1. Create Vercel Account
- [ ] Sign up at [Vercel](https://vercel.com)
- [ ] Connect GitHub account

### 2. Deploy Frontend
- [ ] In Vercel Dashboard: New Project
- [ ] Import GitHub repository
- [ ] Configure:
  - **Root Directory**: `apps/frontend`
  - **Framework Preset**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### 3. Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

- [ ] `VITE_API_URL` = `https://your-backend.onrender.com`
- [ ] `VITE_GOOGLE_CLIENT_ID` = (your Google client ID)

**Apply to**: Production, Preview, Development

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy frontend URL (e.g., `https://gene-forge-analyzer.vercel.app`)

### 5. Update Backend CORS
- [ ] Go back to Render
- [ ] Update `FRONTEND_URL` and `ALLOWED_ORIGINS` with Vercel URL
- [ ] Redeploy backend (or it will auto-redeploy)

### 6. Update Google OAuth Redirect URIs
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Add Vercel URL to authorized redirect URIs:
  - [ ] `https://your-app.vercel.app/auth/callback`

---

## 🐳 Docker Deployment (Optional)

### Local Testing
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up`
- [ ] Test at http://localhost:3000
- [ ] Verify both services are healthy

### Production Docker
- [ ] Build production image: `docker build -t geneforge .`
- [ ] Test locally: `docker run -p 5000:5000 geneforge`
- [ ] Push to registry (Docker Hub, ECR, GCR)
- [ ] Deploy to container platform (Railway, Fly.io, etc.)

---

## ✅ Post-Deployment Verification

### Frontend Checks
- [ ] Visit frontend URL
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] No console errors
- [ ] Assets load (images, fonts, etc.)

### Backend Checks
- [ ] Health endpoint returns 200 OK
- [ ] API endpoints respond correctly
- [ ] CORS headers present in responses
- [ ] No 5xx errors in logs

### Authentication Checks
- [ ] Admin login works
  - [ ] Email: `admin@geneforge.com`
  - [ ] Password: `admin123`
- [ ] Session persists across page reloads
- [ ] Logout works correctly
- [ ] Google OAuth works (if configured)
- [ ] Email OTP works (if configured)

### Feature Checks
- [ ] DNA sequence analysis works
- [ ] CRISPR detection works
- [ ] AI interpretation works (if API keys configured)
- [ ] File upload/download works
- [ ] Admin panel accessible
- [ ] User management works

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] No excessive logging

---

## 🔒 Security Checklist

- [ ] All secrets stored in environment variables (not in code)
- [ ] `SECRET_KEY` and `JWT_SECRET_KEY` are strong random strings
- [ ] `JWT_COOKIE_SECURE=True` in production
- [ ] `JWT_COOKIE_SAMESITE=None` for cross-origin requests
- [ ] CORS configured with specific origins (not `*`)
- [ ] HTTPS enabled on all production URLs
- [ ] Database credentials secured
- [ ] API keys not exposed in frontend code
- [ ] Admin password changed from default

---

## 📊 Monitoring Setup

### Render Monitoring
- [ ] Enable auto-deploy on push
- [ ] Set up health check alerts
- [ ] Configure log retention
- [ ] Monitor resource usage

### Vercel Monitoring
- [ ] Enable deployment notifications
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor build times
- [ ] Check analytics

### Application Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error logging
- [ ] Set up performance monitoring
- [ ] Enable user analytics (optional)

---

## 🐛 Troubleshooting

### If Frontend Can't Connect to Backend
1. [ ] Check `VITE_API_URL` in Vercel
2. [ ] Verify backend is running: `curl https://backend.onrender.com/health`
3. [ ] Check CORS settings in backend
4. [ ] Review Render logs for errors

### If Admin Login Fails
1. [ ] Check backend logs for authentication errors
2. [ ] Verify database is accessible
3. [ ] Ensure admin user exists: `python admin.py list`
4. [ ] Reset admin password: `python admin.py reset`

### If CORS Errors Occur
1. [ ] Verify `ALLOWED_ORIGINS` includes frontend URL
2. [ ] Check `FRONTEND_URL` matches Vercel URL
3. [ ] Ensure `JWT_COOKIE_SECURE=True` and `JWT_COOKIE_SAMESITE=None`
4. [ ] Review browser console for specific CORS error

---

## 📝 Final Steps

- [ ] Update README with production URLs
- [ ] Document any custom configurations
- [ ] Create backup of environment variables
- [ ] Share deployment URLs with team
- [ ] Monitor for 24 hours for any issues
- [ ] Celebrate successful deployment! 🎉

---

## 📚 Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Docker Guide](./DOCKER.md)
- [Quick Reference](../QUICKSTART.md)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated**: January 2026
