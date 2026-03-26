# 📸 Vercel Setup - Visual Guide

## 🚨 Your Site is Still 404 Because Root Directory is NOT Set

Your URL: https://student-attendance-management-syste-iota.vercel.app/
Status: ❌ 404 NOT FOUND

## Why This Happens

Vercel is looking for files in the WRONG location:
- ❌ Looking in: `/` (root folder)
- ✅ Should look in: `/frontend` (where your React app is)

## 🎯 EXACT Steps to Fix (With Screenshots)

### Step 1: Open Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. You should see your project: **student-attendance-management-syste**
3. Click on it

### Step 2: Go to Settings
1. Click the **Settings** tab (top navigation)
2. You should see "General" selected on the left sidebar

### Step 3: Find Root Directory Setting
1. Scroll down on the Settings page
2. Look for a section called **"Root Directory"**
3. It will show:
   ```
   Root Directory
   The directory within your project, in which your code is located.
   Leave this field empty if your code is located in the root directory.
   
   [Empty box or current value]
   ```

### Step 4: Edit Root Directory
1. Click the **"Edit"** button next to Root Directory
2. A text box will appear
3. Type exactly: `frontend`
4. Click **"Save"**

### Step 5: Verify Other Settings
While you're in Settings, verify these:

**Build & Development Settings:**
- Framework Preset: `Create React App` (or auto-detected)
- Build Command: `npm run build` (or empty)
- Output Directory: `build` (or empty)
- Install Command: `npm install` (or empty)

### Step 6: Add Environment Variable (If Not Already Added)
1. Click **"Environment Variables"** in left sidebar
2. Check if `REACT_APP_BASE_URL` exists
3. If not, click **"Add"**:
   - Key: `REACT_APP_BASE_URL`
   - Value: Your backend URL (e.g., `https://your-backend.onrender.com`)
   - Environments: Check all boxes
4. Click **"Save"**

### Step 7: Redeploy
1. Click **"Deployments"** tab (top navigation)
2. You'll see a list of deployments
3. Find the most recent one (top of the list)
4. Click the **⋯** (three dots) on the right
5. Click **"Redeploy"**
6. A popup will appear, click **"Redeploy"** again to confirm
7. Wait 2-3 minutes for deployment to complete

### Step 8: Test Your Site
1. Go to: https://student-attendance-management-syste-iota.vercel.app/
2. You should see the homepage (no 404!)
3. Try clicking "Login" - should work
4. Open browser console (F12) - should have no errors

## 🔍 How to Check If Root Directory is Set

After Step 4, go back to Settings → General and look at Root Directory.
It should show: `frontend`

If it's empty or shows something else, the 404 will continue.

## ⚠️ Common Mistakes

1. **Typing wrong directory name**
   - ❌ Wrong: `Frontend`, `FRONTEND`, `/frontend`, `frontend/`
   - ✅ Correct: `frontend`

2. **Not redeploying after changing settings**
   - Settings only apply to NEW deployments
   - You MUST redeploy after changing Root Directory

3. **Looking at wrong project**
   - Make sure you're in: student-attendance-management-syste
   - Not a different project

## 🎯 What Should Happen

**Before (Current):**
```
Vercel looks in: /
Finds: backend/, frontend/, README.md, etc.
Tries to build: ❌ No package.json in root
Result: 404 NOT FOUND
```

**After (Correct):**
```
Vercel looks in: /frontend
Finds: package.json, src/, public/, etc.
Builds: ✅ npm run build succeeds
Result: ✅ Site works!
```

## 📋 Verification Checklist

After following all steps, verify:

- [ ] Root Directory shows: `frontend`
- [ ] Redeployed after changing settings
- [ ] Deployment shows "Ready" status
- [ ] Site loads without 404
- [ ] Can navigate to different pages
- [ ] No errors in browser console

## 🆘 Still 404 After Setting Root Directory?

If you've set Root Directory to `frontend` and redeployed, but still getting 404:

### Check Build Logs:
1. Deployments → Click on latest deployment
2. Click **"View Build Logs"**
3. Look for errors

### Common Build Errors:

**"npm ERR! missing script: build"**
- Your package.json is missing build script
- Check: frontend/package.json should have `"build": "react-scripts build"`

**"Module not found"**
- Missing dependencies
- Run locally: `cd frontend && npm install`
- Commit package-lock.json

**"Build failed"**
- Check specific error in logs
- Usually a code error or missing dependency

## 💡 Alternative: Use Netlify

If Vercel continues to have issues, try Netlify:

1. Go to: https://netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose GitHub → Select your repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_BASE_URL`
6. Click **"Deploy site"**

Netlify often works better with monorepo structures.

---

**Bottom Line:** You MUST set Root Directory to `frontend` in Vercel Settings!
