# 🚀 Vercel-Render Integration - Quick Reference

## Backend URL
```
https://gene-forge-analyzer-ld7t.onrender.com
```

## Vercel Environment Variables
Add these in your Vercel project settings:

```env
VITE_API_URL=https://gene-forge-analyzer-ld7t.onrender.com
VITE_APP_NAME=Gene Forge Analyzer
```

## Render Environment Variables
Add these in your Render web service:

```env
# Required
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key-minimum-32-chars
JWT_SECRET_KEY=your-jwt-secret-minimum-32-chars

# CORS Configuration
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://gene-forge-analyzer.vercel.app

# Environment
NODE_ENV=production
FLASK_ENV=production

# Optional - AI Features
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Optional - Email/OTP
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Quick Test Commands

### Test Backend Health
```bash
curl https://gene-forge-analyzer-ld7t.onrender.com/health
```

Expected:
```json
{"status":"ok","service":"gene-forge-backend","timestamp":"..."}
```

### Test Backend Root
```bash
curl https://gene-forge-analyzer-ld7t.onrender.com/
```

Expected:
```json
{"msg":"Welcome to Gene Forge API","status":"online","version":"1.0.0"}
```

## Deployment Order

1. **Deploy Backend First** (Render)
   - Push code to GitHub
   - Render auto-deploys
   - Wait for build to complete
   - Note the backend URL

2. **Configure Frontend** (Vercel)
   - Add `VITE_API_URL` environment variable
   - Point to Render backend URL
   - Deploy/Redeploy

3. **Update Backend CORS**
   - Add actual Vercel domain to `ALLOWED_ORIGINS`
   - Redeploy if needed

## Troubleshooting Quick Fixes

### CORS Error
```bash
# Check Render logs for:
INFO: Incoming Request Origin: https://your-app.vercel.app

# If origin is missing from ALLOWED_ORIGINS, add it and redeploy
```

### API Not Connecting
```bash
# Verify environment variable in Vercel
echo $VITE_API_URL

# Should output: https://gene-forge-analyzer-ld7t.onrender.com
```

### Backend Sleeping (Render Free Tier)
```bash
# First request may take 30-60 seconds
# Subsequent requests will be fast
```

## Files Changed Summary

- ✅ `apps/backend/app.py` - CORS + logging
- ✅ `apps/frontend/vercel.json` - Backend URL
- ✅ `apps/frontend/.env.example` - Production docs
- ✅ `apps/backend/.env.example` - All variables
- ✅ `README.md` - Full documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Step-by-step
- ✅ All Dockerfiles - Node 20, health checks

## Ready to Deploy ✨

All changes are committed and ready. Just push to GitHub and follow the deployment guides!
