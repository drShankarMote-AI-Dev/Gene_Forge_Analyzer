# Production Deployment Guide - Gene Forge Analyzer

## 🚀 Overview

This guide provides step-by-step instructions for deploying Gene Forge Analyzer to production with **Vercel (Frontend)** and **Render (Backend)**.

## 📋 Prerequisites

- Vercel account (free tier works)
- Render account (free tier works)
- OpenAI API key (for AI features)
- Admin credentials for the application

---

## 🎯 Backend Deployment (Render)

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `gene-forge-analyzer-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `apps/backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app`

### Step 2: Set Environment Variables on Render

Go to **Environment** tab and add these variables:

#### Required Variables
```bash
# Security
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# Admin Credentials
ADMIN_EMAIL=admin@geneforge.com
ADMIN_PASSWORD=your-secure-admin-password

# AI Configuration (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-app-name.vercel.app

# CORS Origins (comma-separated, update after Vercel deployment)
ALLOWED_ORIGINS=https://your-app-name.vercel.app

# Database (Render provides this automatically)
DATABASE_URL=<auto-populated-by-render>

# Production Mode
NODE_ENV=production
FLASK_ENV=production
```

#### Optional Variables
```bash
# Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@geneforge.com

# Alternative AI Models
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
```

### Step 3: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Copy your backend URL: `https://gene-forge-analyzer-backend.onrender.com`

### Step 4: Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "service": "gene-forge-backend",
  "timestamp": "2026-02-12T00:00:00Z",
  "version": "1.0.0"
}
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables on Vercel

Go to **Settings** → **Environment Variables** and add:

```bash
# Backend API URL (use your Render backend URL)
VITE_API_BASE_URL=https://gene-forge-analyzer-backend.onrender.com

# Google OAuth (if using)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# App Name
VITE_APP_NAME=Gene Forge Analyzer
```

### Step 3: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Copy your frontend URL: `https://your-app-name.vercel.app`

### Step 4: Update Backend CORS

**IMPORTANT**: Go back to Render and update these environment variables:

```bash
FRONTEND_URL=https://your-app-name.vercel.app
ALLOWED_ORIGINS=https://your-app-name.vercel.app
```

Then **manually redeploy** the backend service on Render.

---

## 🔐 Security Configuration

### JWT Cookies (Cross-Domain)

The application uses **secure, HTTP-only cookies** for authentication. The backend is configured to:

- Set `Secure=true` (HTTPS only)
- Set `SameSite=None` (cross-domain)
- Include credentials in CORS

### CORS Setup

The backend allows requests from:
- Your Vercel frontend URL
- Localhost (in development mode only)

---

## 🧪 Testing Production Deployment

### 1. Test Admin Login

1. Go to: `https://your-app-name.vercel.app/admin/login`
2. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. You should be redirected to `/admin/dashboard`

**If login fails:**
- Check Render logs for authentication errors
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly
- Ensure cookies are being sent (check browser DevTools → Network → Cookies)

### 2. Test AI Explanation

1. Go to: `https://your-app-name.vercel.app/tools/gc-content`
2. Paste a DNA sequence (e.g., `ATGCATGCATGC`)
3. Click **"Execute Audit"**
4. Click **"Generate Insight"** in the AI panel

**If AI fails:**
- Check that `OPENAI_API_KEY` is set on Render
- Check Render logs for API errors
- Verify the key is valid and has quota

### 3. Test User Authentication

1. Go to: `https://your-app-name.vercel.app`
2. Try OTP login or Google login
3. Verify you can access `/analysis` page

---

## 🐛 Troubleshooting

### Issue: Admin Login Returns "Invalid Credentials"

**Solution:**
1. Check Render logs: `Dashboard → Logs`
2. Look for `AUTH_FAILURE` messages
3. Verify environment variables are set:
   ```bash
   echo $ADMIN_EMAIL
   echo $ADMIN_PASSWORD
   ```
4. Ensure you're using the **exact** email and password (case-sensitive)

### Issue: AI Explanation Fails

**Symptoms:**
- "AI Engine unavailable" error
- Empty response from `/ai/explain`

**Solution:**
1. Verify `OPENAI_API_KEY` is set on Render
2. Check the key is valid: [OpenAI API Keys](https://platform.openai.com/api-keys)
3. Check your OpenAI quota/billing
4. Review Render logs for detailed error messages

### Issue: CORS Errors in Browser Console

**Symptoms:**
```
Access to fetch at 'https://backend.onrender.com/auth/admin/login' 
from origin 'https://app.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Ensure `FRONTEND_URL` on Render matches your Vercel URL **exactly**
2. Ensure `ALLOWED_ORIGINS` includes your Vercel URL
3. Redeploy the backend after changing environment variables
4. Clear browser cache and cookies

### Issue: Cookies Not Being Set

**Symptoms:**
- Login succeeds but user is not authenticated
- No `access_token_cookie` in browser

**Solution:**
1. Ensure backend is using HTTPS (Render provides this automatically)
2. Check `JWT_COOKIE_SECURE=True` and `JWT_COOKIE_SAMESITE=None`
3. Verify browser allows third-party cookies
4. Check browser DevTools → Application → Cookies

---

## 📊 Monitoring

### Backend Logs (Render)

View real-time logs:
```
Render Dashboard → Your Service → Logs
```

Look for:
- `DB_SEED: Admin credentials synchronized` (admin user created)
- `AUTH_FAILURE` (login issues)
- `AI_ANALYSIS` (AI usage)
- `CORS` errors

### Frontend Logs (Vercel)

View deployment logs:
```
Vercel Dashboard → Your Project → Deployments → View Function Logs
```

---

## 🔄 Redeployment

### Backend (Render)

**Manual Redeploy:**
1. Go to Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Auto-Deploy:**
- Render auto-deploys on every push to `main` branch

### Frontend (Vercel)

**Manual Redeploy:**
1. Go to Vercel Dashboard
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment

**Auto-Deploy:**
- Vercel auto-deploys on every push to `main` branch

---

## 🎯 Production Checklist

Before going live, ensure:

- [ ] `OPENAI_API_KEY` is set on Render (required for AI)
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set on Render
- [ ] `JWT_SECRET_KEY` is a strong, random string
- [ ] `SECRET_KEY` is a strong, random string
- [ ] `FRONTEND_URL` on Render matches your Vercel URL
- [ ] `VITE_API_BASE_URL` on Vercel matches your Render URL
- [ ] Admin login works in production
- [ ] AI explanation works in production
- [ ] User OTP/Google login works
- [ ] CORS is properly configured (no console errors)
- [ ] Cookies are being set correctly

---

## 📝 Environment Variables Summary

### Backend (Render)

| Variable | Required | Example |
|----------|----------|---------|
| `OPENAI_API_KEY` | **YES** (for AI) | `sk-proj-...` |
| `ADMIN_EMAIL` | **YES** | `admin@geneforge.com` |
| `ADMIN_PASSWORD` | **YES** | `SecurePass123!` |
| `JWT_SECRET_KEY` | **YES** | `random-secret-key` |
| `SECRET_KEY` | **YES** | `random-secret-key` |
| `FRONTEND_URL` | **YES** | `https://app.vercel.app` |
| `ALLOWED_ORIGINS` | **YES** | `https://app.vercel.app` |
| `NODE_ENV` | Recommended | `production` |
| `GOOGLE_CLIENT_ID` | Optional | `123...apps.googleusercontent.com` |
| `EMAIL_USERNAME` | Optional | `your-email@gmail.com` |

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_BASE_URL` | **YES** | `https://backend.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Optional | `123...apps.googleusercontent.com` |
| `VITE_APP_NAME` | Optional | `Gene Forge Analyzer` |

---

## 🎉 Success!

Your Gene Forge Analyzer is now live in production! 

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://gene-forge-analyzer-backend.onrender.com`
- **Admin Panel**: `https://your-app-name.vercel.app/admin/login`

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review Render and Vercel logs
3. Verify all environment variables are set correctly
4. Ensure your OpenAI API key has sufficient quota

---

**Last Updated**: February 2026  
**Version**: 1.0.0
