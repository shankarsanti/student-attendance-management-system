# Vercel 404 Troubleshooting

## Your Site
https://student-attendance-management-syste-iota.vercel.app/

## Current Issue
Site returns 404 error - cannot open

## Root Cause
Vercel is not building from the correct directory or hasn't deployed the latest changes.

## ✅ Solution Checklist

### 1. Set Root Directory (MOST IMPORTANT)
- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Settings → General
- [ ] Root Directory: **frontend** (not empty!)
- [ ] Click Save
- [ ] Redeploy

### 2. Verify Build Settings
- [ ] Framework Preset: Create React App
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Install Command: `npm install`

### 3. Check Environment Variables
- [ ] Settings → Environment Variables
- [ ] Add: `REACT_APP_BASE_URL` = your backend URL
- [ ] Select all environments

### 4. Redeploy
- [ ] Deployments tab
- [ ] Click ⋯ on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait 2-3 minutes

## 🔍 How to Check Build Logs

1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. View Build Logs
4. Look for errors

## Common Errors & Fixes

### Error: "Cannot find package.json"
**Fix:** Set Root Directory to `frontend`

### Error: "Build failed"
**Fix:** Check specific error in logs, usually missing dependencies

### Error: "Module not found"
**Fix:** Run `npm install` locally, commit package-lock.json

### Error: Still 404 after deployment
**Fix:** 
1. Check if `vercel.json` is in `frontend` folder
2. Verify build completed successfully
3. Check Output Directory is `build`

## 📋 Correct Vercel Configuration

```
Project Settings:
├── Root Directory: frontend
├── Framework: Create React App
├── Build Command: npm run build
├── Output Directory: build
└── Install Command: npm install

Environment Variables:
└── REACT_APP_BASE_URL: https://your-backend-url.onrender.com

Files Required:
├── frontend/vercel.json ✓
├── frontend/package.json ✓
└── frontend/public/_redirects ✓
```

## 🎯 Step-by-Step Fix

1. **Open Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Project**
   - Click on "student-attendance-management-syste"

3. **Go to Settings**
   - Click "Settings" tab

4. **Edit Root Directory**
   - Scroll to "Root Directory"
   - Click "Edit"
   - Type: `frontend`
   - Click "Save"

5. **Verify Build Settings**
   - Framework Preset: Create React App
   - Build Command: npm run build
   - Output Directory: build

6. **Add Environment Variable**
   - Go to "Environment Variables"
   - Click "Add"
   - Key: `REACT_APP_BASE_URL`
   - Value: Your backend URL
   - Environments: All
   - Click "Save"

7. **Redeploy**
   - Go to "Deployments" tab
   - Find latest deployment
   - Click ⋯ (three dots)
   - Click "Redeploy"
   - Wait for completion

8. **Test**
   - Visit: https://student-attendance-management-syste-iota.vercel.app/
   - Should see homepage (no 404)

## 🆘 Still Not Working?

### Option A: Delete and Redeploy
1. Delete current Vercel project
2. Create new project
3. Import from GitHub
4. Set Root Directory: `frontend`
5. Deploy

### Option B: Use Netlify Instead
1. Go to https://netlify.com
2. New site from Git
3. Select repository
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `frontend/build`
7. Deploy

## 📞 Need Help?

Check these files:
- DEPLOYMENT_GUIDE.md - Complete guide
- QUICK_DEPLOY.md - Quick steps
- START_HERE.md - Getting started

---

**Key Point:** The Root Directory MUST be set to `frontend` in Vercel settings!
