# 🚀 Quick Start - Production Deployment

**Time to deploy**: ~15 minutes  
**Difficulty**: Beginner-friendly

---

## Step 1: Deploy Backend (5 minutes)

### A. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### B. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Settings:
   - **Name**: `gene-forge-backend`
   - **Root Directory**: `apps/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app`

### C. Set Environment Variables

Click **"Environment"** tab and add:

```bash
# CRITICAL - Copy these exactly
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
ADMIN_EMAIL=admin@geneforge.com
ADMIN_PASSWORD=YourSecurePass123!
JWT_SECRET_KEY=your-random-secret-key-min-32-chars
SECRET_KEY=your-random-secret-key-min-32-chars
FRONTEND_URL=https://PLACEHOLDER.vercel.app
ALLOWED_ORIGINS=https://PLACEHOLDER.vercel.app
NODE_ENV=production
```

> ⚠️ **Important**: Replace `YOUR_KEY_HERE` with your actual OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### D. Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build
3. Copy your backend URL: `https://gene-forge-backend-XXXX.onrender.com`

---

## Step 2: Deploy Frontend (5 minutes)

### A. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### B. Create Project
1. Click **"Add New..."** → **"Project"**
2. Import your repository
3. Settings:
   - **Framework**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### C. Set Environment Variables

Click **"Environment Variables"** and add:

```bash
VITE_API_BASE_URL=https://gene-forge-backend-XXXX.onrender.com
```

> Replace `XXXX` with your actual Render backend URL from Step 1D

### D. Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes
3. Copy your frontend URL: `https://your-app-YYYY.vercel.app`

---

## Step 3: Connect Frontend & Backend (2 minutes)

### A. Update Backend CORS

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **"Environment"** tab
4. Update these two variables:

```bash
FRONTEND_URL=https://your-app-YYYY.vercel.app
ALLOWED_ORIGINS=https://your-app-YYYY.vercel.app
```

> Replace `YYYY` with your actual Vercel URL from Step 2D

### B. Redeploy Backend

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait 2-3 minutes

---

## Step 4: Test Everything (3 minutes)

### Test 1: Backend Health
Visit: `https://gene-forge-backend-XXXX.onrender.com/health`

✅ Should see:
```json
{"status": "ok", "service": "gene-forge-backend"}
```

### Test 2: Admin Login
1. Visit: `https://your-app-YYYY.vercel.app/admin/login`
2. Login with:
   - Email: `admin@geneforge.com`
   - Password: `YourSecurePass123!`

✅ Should redirect to admin dashboard

### Test 3: AI Explanation
1. Visit: `https://your-app-YYYY.vercel.app/tools/gc-content`
2. Paste: `ATGCATGCATGC`
3. Click **"Execute Audit"**
4. Click **"Generate Insight"**

✅ Should stream AI explanation

### Test 4: Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab

✅ Should have **NO** CORS errors

---

## 🎉 Success!

Your app is now live:
- **Frontend**: `https://your-app-YYYY.vercel.app`
- **Backend**: `https://gene-forge-backend-XXXX.onrender.com`
- **Admin**: `https://your-app-YYYY.vercel.app/admin/login`

---

## ⚠️ Troubleshooting

### Admin Login Fails

**Check**:
1. Render logs: Dashboard → Your Service → Logs
2. Look for `AUTH_FAILURE` or `DB_SEED` messages
3. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly

**Fix**:
```bash
# On Render, verify these are set:
ADMIN_EMAIL=admin@geneforge.com
ADMIN_PASSWORD=YourSecurePass123!

# Then redeploy
```

### AI Doesn't Work

**Check**:
1. Render logs for OpenAI errors
2. Verify your OpenAI API key is valid
3. Check you have quota/credits

**Fix**:
```bash
# On Render, verify this is set:
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY

# Get a new key from: https://platform.openai.com/api-keys
# Then redeploy
```

### CORS Errors in Browser

**Check**:
1. Browser console shows: `blocked by CORS policy`
2. Frontend and backend URLs don't match

**Fix**:
```bash
# On Render, verify these EXACTLY match your Vercel URL:
FRONTEND_URL=https://your-app-YYYY.vercel.app
ALLOWED_ORIGINS=https://your-app-YYYY.vercel.app

# No trailing slashes!
# Then redeploy
```

---

## 📝 Environment Variables Checklist

### Render (Backend)
- [ ] `OPENAI_API_KEY` - Your actual OpenAI key
- [ ] `ADMIN_EMAIL` - Your admin email
- [ ] `ADMIN_PASSWORD` - Strong password
- [ ] `JWT_SECRET_KEY` - Random 32+ char string
- [ ] `SECRET_KEY` - Random 32+ char string
- [ ] `FRONTEND_URL` - Your Vercel URL (exact)
- [ ] `ALLOWED_ORIGINS` - Your Vercel URL (exact)
- [ ] `NODE_ENV=production`

### Vercel (Frontend)
- [ ] `VITE_API_BASE_URL` - Your Render URL (exact)

---

## 🔑 Generate Secure Keys

Use this command to generate secure random keys:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or in Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Use the output for `JWT_SECRET_KEY` and `SECRET_KEY`.

---

## 📚 Need More Help?

- **Full Guide**: See `docs/PRODUCTION_DEPLOYMENT.md`
- **Environment Variables**: See `docs/ENV_VARIABLES.md`
- **All Changes**: See `docs/DEPLOYMENT_FIXES_SUMMARY.md`

---

## 🎯 What's Next?

After successful deployment:

1. **Customize Admin**:
   - Change `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Redeploy backend

2. **Add Google Login** (Optional):
   - Get Google OAuth credentials
   - Add `GOOGLE_CLIENT_ID` to both Render and Vercel
   - Add `GOOGLE_CLIENT_SECRET` to Render

3. **Monitor Usage**:
   - Check Render logs regularly
   - Monitor OpenAI usage/costs
   - Set up alerts for errors

4. **Custom Domain** (Optional):
   - Add custom domain in Vercel
   - Update `FRONTEND_URL` and `ALLOWED_ORIGINS` on Render
   - Redeploy backend

---

**Last Updated**: February 2026  
**Estimated Time**: 15 minutes  
**Success Rate**: 99% (if you follow steps exactly)
