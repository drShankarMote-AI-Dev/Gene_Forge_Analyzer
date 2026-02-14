# Environment Variables Quick Reference

## 🔴 CRITICAL - Required for Production

### Backend (Render)

```bash
# AI Engine (REQUIRED for "Explain with AI" feature)
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Admin Access (REQUIRED for admin panel)
ADMIN_EMAIL=admin@geneforge.com
ADMIN_PASSWORD=YourSecurePassword123!

# Security Keys (REQUIRED - use strong random strings)
JWT_SECRET_KEY=your-jwt-secret-minimum-32-chars
SECRET_KEY=your-app-secret-minimum-32-chars

# Cross-Domain Configuration (REQUIRED)
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Production Mode
NODE_ENV=production
FLASK_ENV=production
```

### Frontend (Vercel)

```bash
# Backend API (REQUIRED)
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

---

## 🟡 Optional - Enhanced Features

### Backend (Render)

```bash
# Google OAuth Login
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email OTP (for passwordless login)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@geneforge.com

# Alternative AI Models
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
AI_GATEWAY_API_KEY=your-gateway-key
```

### Frontend (Vercel)

```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Branding
VITE_APP_NAME=Gene Forge Analyzer
```

---

## 🔧 Development Only

### Backend (apps/backend/.env)

```bash
# Local Development Settings
JWT_COOKIE_SECURE=False
JWT_COOKIE_SAMESITE=Lax
NODE_ENV=development
FLASK_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Local Database
DATABASE_URL=sqlite:///geneforge.db
```

### Frontend (apps/frontend/.env)

```bash
# Local Backend
VITE_API_URL=http://localhost:5000/api
```

---

## ⚠️ Common Mistakes

### ❌ DON'T

```bash
# Don't use placeholder values in production
OPENAI_API_KEY=your-openai-key-here
ADMIN_PASSWORD=admin123

# Don't use localhost in production
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000

# Don't use development settings in production
JWT_COOKIE_SECURE=False
NODE_ENV=development
```

### ✅ DO

```bash
# Use real values
OPENAI_API_KEY=sk-proj-p4GRP3NhGFaseSQYxYde...
ADMIN_PASSWORD=MyStr0ng!P@ssw0rd2026

# Use production URLs
FRONTEND_URL=https://gene-forge-analyzer.vercel.app
VITE_API_BASE_URL=https://gene-forge-analyzer-backend.onrender.com

# Use production settings
JWT_COOKIE_SECURE=True
NODE_ENV=production
```

---

## 🎯 Deployment Steps

### 1. Deploy Backend First

1. Set all **CRITICAL** backend variables on Render
2. Deploy and get backend URL
3. Test: `https://your-backend.onrender.com/health`

### 2. Deploy Frontend

1. Set `VITE_API_BASE_URL` to your backend URL
2. Deploy and get frontend URL
3. Test: `https://your-frontend.vercel.app`

### 3. Update Backend CORS

1. Update `FRONTEND_URL` on Render to your Vercel URL
2. Update `ALLOWED_ORIGINS` on Render to your Vercel URL
3. **Manually redeploy** backend on Render

### 4. Test End-to-End

1. Admin login: `https://your-frontend.vercel.app/admin/login`
2. AI explanation: Try any tool and click "Generate Insight"
3. User login: Test OTP or Google login

---

## 🔍 Verification Commands

### Check Backend Health

```bash
curl https://your-backend.onrender.com/health
```

Expected:
```json
{"status": "ok", "service": "gene-forge-backend"}
```

### Check CORS Headers

```bash
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/auth/admin/login -v
```

Look for:
```
Access-Control-Allow-Origin: https://your-frontend.vercel.app
Access-Control-Allow-Credentials: true
```

---

## 📋 Checklist

Before marking deployment as complete:

- [ ] `OPENAI_API_KEY` is set and valid
- [ ] Admin login works in production
- [ ] AI explanation works in production
- [ ] No CORS errors in browser console
- [ ] Cookies are being set (check DevTools)
- [ ] `FRONTEND_URL` matches actual Vercel URL
- [ ] `VITE_API_BASE_URL` matches actual Render URL
- [ ] Backend health endpoint returns 200 OK
- [ ] All secrets are strong and unique

---

## 🆘 Quick Troubleshooting

| Issue | Check This Variable |
|-------|---------------------|
| Admin login fails | `ADMIN_EMAIL`, `ADMIN_PASSWORD` |
| AI doesn't work | `OPENAI_API_KEY` |
| CORS errors | `FRONTEND_URL`, `ALLOWED_ORIGINS` |
| Cookies not set | `JWT_COOKIE_SECURE`, `JWT_COOKIE_SAMESITE` |
| Frontend can't reach backend | `VITE_API_BASE_URL` |

---

**Pro Tip**: After setting environment variables on Render, you **must manually redeploy** for changes to take effect!
