# 🧬 Gene Forge Analyzer - Deployment Guide

Complete guide for deploying the Gene Forge Analyzer monorepo to production.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Render Deployment (Backend)](#render-deployment-backend)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

The Gene Forge Analyzer is a **monorepo** with two main applications:

```
Gene_Forge_Analyzer/
├── apps/
│   ├── frontend/          # React + Vite + TypeScript
│   └── backend/           # Flask + Python
├── Dockerfile.frontend    # Production frontend build
├── Dockerfile.backend     # Production backend build
├── Dockerfile.fullstack   # Combined deployment (optional)
├── docker-compose.yml     # Local development with Docker
├── vercel.json            # Vercel deployment config
└── render.yaml            # Render deployment config
```

**Deployment Strategy:**
- **Frontend**: Vercel (Static hosting with CDN)
- **Backend**: Render (Python web service)
- **Alternative**: Docker Compose (Self-hosted)

---

## ✅ Prerequisites

### Required Software
- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **npm** >= 10.0.0
- **Docker** (optional, for containerized deployment)

### Required Accounts
- [Vercel Account](https://vercel.com) (for frontend)
- [Render Account](https://render.com) (for backend)
- [Google Cloud Console](https://console.cloud.google.com/) (for OAuth)
- [OpenAI API](https://platform.openai.com/) (for AI features)

---

## 🚀 Local Development

### 1. Install All Dependencies

```bash
# Install both frontend and backend dependencies
npm run install:all
```

This command will:
- Install root dependencies
- Install frontend dependencies (`apps/frontend`)
- Install backend dependencies (`apps/backend`)

### 2. Configure Environment Variables

#### Frontend (`apps/frontend/.env`)
```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/frontend/.env`:
```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Backend (`apps/backend/.env`)
```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///geneforge.db
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key
```

### 3. Run Development Servers

#### Option A: Run Both Servers Concurrently
```bash
npm run dev
```

This starts:
- Backend at `http://localhost:5000`
- Frontend at `http://localhost:5173`

#### Option B: Run Servers Separately
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Login**: http://localhost:5173/admin

**Default Admin Credentials:**
- Email: `admin@geneforge.com`
- Password: `admin123`

---

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended for Local/Self-Hosted)

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Or use docker-compose directly
docker-compose up --build
```

**Services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Stop Services:**
```bash
docker-compose down
```

### Option 2: Individual Dockerfiles

#### Build Frontend Only
```bash
docker build -f Dockerfile.frontend -t geneforge-frontend .
docker run -p 3000:80 geneforge-frontend
```

#### Build Backend Only
```bash
docker build -f Dockerfile.backend -t geneforge-backend .
docker run -p 5000:5000 \
  -e DATABASE_URL=sqlite:///geneforge.db \
  -e SECRET_KEY=your-secret \
  geneforge-backend
```

### Option 3: Fullstack Dockerfile

```bash
docker build -f Dockerfile.fullstack -t geneforge-fullstack .
docker run -p 80:80 -p 5000:5000 geneforge-fullstack
```

---

## ☁️ Vercel Deployment (Frontend)

### 1. Prepare Frontend

The frontend is configured in `apps/frontend/vercel.json`.

### 2. Deploy to Vercel

#### Via Vercel CLI
```bash
cd apps/frontend
npm install -g vercel
vercel --prod
```

#### Via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Set **Root Directory**: `apps/frontend`
5. **Framework Preset**: Vite
6. Click **Deploy**

### 3. Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL = https://gene-forge-analyzer-ld7t.onrender.com
VITE_GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com
```

### 4. Update Google OAuth Redirect URIs

In [Google Cloud Console](https://console.cloud.google.com/):
1. Go to **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add **Authorized Redirect URIs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```

### 5. Redeploy

After setting environment variables, trigger a redeploy in Vercel.

---

## 🔧 Render Deployment (Backend)

### 1. Prepare Backend

The backend is configured in `render.yaml`.

### 2. Deploy to Render

#### Via Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

#### Manual Web Service Creation
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `gene-forge-backend`
   - **Root Directory**: `apps/backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --workers=4 --bind=0.0.0.0:$PORT --timeout=120`

### 3. Configure Environment Variables

In Render Dashboard → Service → Environment:

```
SECRET_KEY = <auto-generated>
JWT_SECRET_KEY = <auto-generated>
DATABASE_URL = sqlite:///geneforge.db
FRONTEND_URL = https://your-app.vercel.app
ALLOWED_ORIGINS = https://your-app.vercel.app
JWT_COOKIE_SECURE = True
JWT_COOKIE_SAMESITE = None
NODE_ENV = production
FLASK_ENV = production
OPENAI_API_KEY = your-openai-key
GEMINI_API_KEY = your-gemini-key
EMAIL_USERNAME = your-email@gmail.com
EMAIL_PASSWORD = your-gmail-app-password
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

### 4. Get Backend URL

After deployment, copy your Render backend URL:
```
https://gene-forge-analyzer-ld7t.onrender.com
```

### 5. Update Frontend Configuration

Update `apps/frontend/vercel.json`:
```json
{
  "env": {
    "VITE_API_URL": "https://your-render-backend.onrender.com"
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-render-backend.onrender.com/api/$1"
    }
  ]
}
```

Redeploy frontend on Vercel.

---

## 🔐 Environment Variables

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (local) or `https://backend.onrender.com` (prod) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `VITE_APP_NAME` | Application name | `Gene Forge Analyzer` |

### Backend Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SECRET_KEY` | Flask secret key | ✅ | Auto-generated on Render |
| `JWT_SECRET_KEY` | JWT signing key | ✅ | Auto-generated on Render |
| `DATABASE_URL` | Database connection | ✅ | `sqlite:///geneforge.db` |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ | `https://app.vercel.app` |
| `ALLOWED_ORIGINS` | CORS allowed origins | ✅ | `https://app.vercel.app` |
| `JWT_COOKIE_SECURE` | Use secure cookies | ✅ | `True` (prod), `False` (dev) |
| `JWT_COOKIE_SAMESITE` | Cookie SameSite policy | ✅ | `None` (prod), `Lax` (dev) |
| `OPENAI_API_KEY` | OpenAI API key | ❌ | `sk-...` |
| `GEMINI_API_KEY` | Google Gemini API key | ❌ | `AI...` |
| `EMAIL_USERNAME` | SMTP email username | ❌ | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | SMTP email password | ❌ | Gmail App Password |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ❌ | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | ❌ | `GOCSPX-...` |

---

## 🐛 Troubleshooting

### Admin Login Returns 404

**Problem**: Admin login fails with "Not Found" error.

**Solution**:
1. Ensure backend is running: `http://localhost:5000/health`
2. Check `VITE_API_URL` in frontend `.env`
3. Verify CORS settings in backend `.env`

### CORS Errors in Production

**Problem**: API calls blocked by CORS policy.

**Solution**:
1. Update `ALLOWED_ORIGINS` in Render environment variables
2. Include your Vercel domain: `https://your-app.vercel.app`
3. Set `JWT_COOKIE_SECURE=True` and `JWT_COOKIE_SAMESITE=None`

### Google OAuth Not Working

**Problem**: Google sign-in fails or redirects incorrectly.

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` matches in both frontend and backend
2. Add authorized redirect URIs in Google Cloud Console:
   - `http://localhost:5173/auth/callback` (dev)
   - `https://your-app.vercel.app/auth/callback` (prod)
3. Ensure `GOOGLE_CLIENT_SECRET` is set in backend

### Email OTP Not Sending

**Problem**: OTP emails not received.

**Solution**:
1. Use Gmail App Password, not regular password
2. Generate at: https://myaccount.google.com/apppasswords
3. Set `EMAIL_USERNAME` and `EMAIL_PASSWORD` in backend
4. Verify `EMAIL_HOST=smtp.gmail.com` and `EMAIL_PORT=587`

### Docker Build Fails

**Problem**: Docker build errors.

**Solution**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Render Deployment Timeout

**Problem**: Render service times out during deployment.

**Solution**:
1. Check build logs in Render dashboard
2. Ensure `requirements.txt` is in `apps/backend/`
3. Increase timeout in `render.yaml`:
   ```yaml
   startCommand: "gunicorn app:app --timeout=120"
   ```

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)

---

## 🆘 Support

For issues and questions:
- GitHub Issues: https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/issues
- Email: admin@geneforge.com

---

**Last Updated**: January 2026
