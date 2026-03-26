# Vercel 404 Error - Quick Fix Guide

## 🔴 Problem
Getting `404: NOT_FOUND` error after deploying to Vercel.

## ✅ Solution Steps

### Step 1: Verify Files Are Committed

Make sure these files are in your repository:

```bash
# Check if files exist
ls frontend/vercel.json
ls frontend/public/_redirects
ls frontend/netlify.toml

# Add and commit if not already done
git add .
git commit -m "Add deployment configuration files"
git push origin main
```

### Step 2: Vercel Project Settings

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### Step 3: Add Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add this variable:
   - **Name:** `REACT_APP_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.onrender.com`)
   - **Environments:** Check all (Production, Preview, Development)
3. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click on the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

### Step 5: Verify Deployment

Visit your Vercel URL. You should see the homepage.

## 🔧 Alternative: Deploy from Scratch

If the above doesn't work, try redeploying:

### Option A: Redeploy on Vercel

1. Delete the current project on Vercel
2. Go to Vercel dashboard → **Add New** → **Project**
3. Import your GitHub repository
4. Configure settings:
   - **Root Directory:** `frontend`
   - **Framework:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Add environment variable: `REACT_APP_BASE_URL`
6. Click **Deploy**

### Option B: Use Netlify Instead

1. Go to https://netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose GitHub and select your repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
5. Add environment variable:
   - **Key:** `REACT_APP_BASE_URL`
   - **Value:** Your backend URL
6. Click **Deploy site**

## 🐛 Common Issues & Fixes

### Issue 1: Build Fails

**Error:** Build command failed

**Fix:**
```bash
# Test build locally first
cd frontend
npm install
npm run build

# If it works locally, check Vercel logs for specific error
```

### Issue 2: Blank Page After Deployment

**Cause:** Wrong build directory or routing issue

**Fix:**
- Verify `vercel.json` exists in `frontend` folder
- Check browser console for errors
- Verify `REACT_APP_BASE_URL` is set correctly

### Issue 3: API Calls Failing

**Cause:** CORS or wrong API URL

**Fix:**
1. Check `REACT_APP_BASE_URL` in Vercel environment variables
2. Verify backend is running (visit backend URL directly)
3. Update backend CORS to allow your Vercel URL:

```javascript
// backend/index.js
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://your-app.vercel.app',  // Add your Vercel URL
        process.env.FRONTEND_URL
    ],
    credentials: true
};
app.use(cors(corsOptions));
```

### Issue 4: Environment Variables Not Working

**Fix:**
1. Redeploy after adding environment variables
2. Make sure variable name starts with `REACT_APP_`
3. Check variable is set for all environments

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] `vercel.json` exists in `frontend` folder
- [ ] `_redirects` file exists in `frontend/public` folder
- [ ] All files are committed to git
- [ ] Build works locally (`npm run build`)
- [ ] Backend is deployed and accessible
- [ ] Environment variables are documented
- [ ] CORS is configured in backend

## 🎯 Quick Test Commands

```bash
# Test if backend is running
curl https://your-backend-url.onrender.com

# Test local build
cd frontend
npm run build
npx serve -s build

# Check git status
git status
git log --oneline -5
```

## 📞 Still Having Issues?

1. Check Vercel deployment logs:
   - Go to **Deployments** → Click on deployment → **View Build Logs**

2. Check browser console:
   - Open your deployed site
   - Press F12 → Console tab
   - Look for errors

3. Verify backend:
   - Visit backend URL directly
   - Should see a response (not 404)

4. Check environment variables:
   - Vercel dashboard → Settings → Environment Variables
   - Verify `REACT_APP_BASE_URL` is set

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Vercel deployment shows "Ready"
- ✅ Homepage loads without errors
- ✅ Login page works
- ✅ Can login as admin/teacher/student
- ✅ No CORS errors in browser console
- ✅ API calls work (check Network tab)

---

**Last Updated:** March 26, 2026
