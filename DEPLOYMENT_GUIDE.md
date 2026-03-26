# Complete Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the School Management System to production using:
- **Backend:** Render (or Railway/Heroku)
- **Frontend:** Vercel or Netlify
- **Database:** MongoDB Atlas

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables documented
- [ ] Build tested locally
- [ ] Dependencies up to date

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for free account
3. Create a new project: "School Management System"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select cloud provider and region (closest to your users)
4. Cluster name: `Cluster0`
5. Click "Create"

### 1.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `school_admin`
5. Password: Click "Autogenerate Secure Password" and SAVE IT
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy connection string:
```
mongodb+srv://school_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. Add database name: `/smsproject` before the `?`

Final connection string:
```
mongodb+srv://school_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smsproject?retryWrites=true&w=majority
```

## 🔧 Step 2: Deploy Backend (Render)

### 2.1 Prepare Backend for Deployment

1. Make sure `backend/package.json` has start script:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

2. Update `backend/index.js` to use environment PORT:
```javascript
const PORT = process.env.PORT || 5001
```

### 2.2 Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `school-management-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:

```
MONGO_URL=mongodb+srv://school_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smsproject?retryWrites=true&w=majority
SECRET_KEY=your-secret-key-change-this-in-production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
FRONTEND_URL=https://your-frontend-url.vercel.app
```

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL: `https://school-management-backend.onrender.com`

### 2.3 Test Backend Deployment

Visit: `https://your-backend-url.onrender.com`

You should see a response (not 404).

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Prepare Frontend for Deployment

1. Update `frontend/.env`:
```env
REACT_APP_BASE_URL=https://your-backend-url.onrender.com
```

2. Test build locally:
```bash
cd frontend
npm run build
```

If build succeeds, you're ready to deploy.

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

6. Add Environment Variable:
   - Click "Environment Variables"
   - Add:
     - **Name:** `REACT_APP_BASE_URL`
     - **Value:** `https://your-backend-url.onrender.com`
   - Select all environments (Production, Preview, Development)

7. Click "Deploy"
8. Wait for deployment (3-5 minutes)
9. Copy your frontend URL: `https://your-app.vercel.app`

### 3.3 Update Backend FRONTEND_URL

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Click "Save Changes"
6. Service will auto-redeploy

## 🌐 Alternative: Deploy Frontend to Netlify

### 3.1 Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure:
   - **Branch:** `main`
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`

6. Add Environment Variable:
   - Click "Site settings" → "Environment variables"
   - Add:
     - **Key:** `REACT_APP_BASE_URL`
     - **Value:** `https://your-backend-url.onrender.com`

7. Click "Deploy site"
8. Wait for deployment
9. Copy your Netlify URL

### 3.2 Custom Domain (Optional)

**For Vercel:**
1. Go to project settings → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

**For Netlify:**
1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records

## 🔒 Step 4: Security Configuration

### 4.1 Update CORS Settings

In `backend/index.js`, update CORS:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 4.2 Secure Environment Variables

Never commit `.env` files. Make sure `.gitignore` includes:
```
.env
.env.local
.env.production
```

### 4.3 Update Secret Keys

Generate strong secret keys:
```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use this for `SECRET_KEY` and `JWT_SECRET`.

## 🧪 Step 5: Testing Deployment

### 5.1 Test Backend

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com

# Test API endpoint
curl https://your-backend-url.onrender.com/api/health
```

### 5.2 Test Frontend

1. Visit your frontend URL
2. Try to login
3. Check browser console for errors
4. Test all features:
   - Admin login
   - Teacher login
   - Student login
   - Fee payment
   - Test creation
   - Lesson scheduling

### 5.3 Check Logs

**Render Logs:**
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Check for errors

**Vercel Logs:**
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. Check "Build Logs" and "Function Logs"

## 🐛 Common Deployment Issues

### Issue 1: 404 NOT_FOUND Error

**Cause:** Routing not configured properly

**Solution:**
- Vercel: Make sure `vercel.json` exists in frontend folder
- Netlify: Make sure `_redirects` file exists in `public` folder
- Check that files are committed to git

### Issue 2: CORS Error

**Cause:** Backend not allowing frontend origin

**Solution:**
```javascript
// backend/index.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

### Issue 3: Environment Variables Not Working

**Cause:** Variables not set or wrong format

**Solution:**
- Vercel: Redeploy after adding variables
- Render: Service auto-redeploys when variables change
- Check variable names match exactly (case-sensitive)
- For React: Must start with `REACT_APP_`

### Issue 4: MongoDB Connection Failed

**Cause:** Wrong connection string or IP not whitelisted

**Solution:**
- Check connection string format
- Verify password doesn't have special characters (or URL encode them)
- Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas
- Check MongoDB Atlas cluster is not paused

### Issue 5: Build Failed

**Cause:** Dependencies or build errors

**Solution:**
```bash
# Test build locally first
cd frontend
npm run build

# Check for errors
# Fix any warnings or errors
# Commit and push fixes
```

### Issue 6: API Calls Failing

**Cause:** Wrong API URL or CORS

**Solution:**
- Check `REACT_APP_BASE_URL` is set correctly
- Verify backend is running (visit backend URL)
- Check browser console for exact error
- Verify CORS configuration

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Setup Monitoring

**Render:**
- Enable email notifications for deployment failures
- Check logs regularly

**Vercel:**
- Enable deployment notifications
- Use Vercel Analytics (optional)

### 6.2 Database Backups

**MongoDB Atlas:**
1. Go to "Backup" tab
2. Enable "Cloud Backup" (paid feature)
3. Or manually export data:
```bash
mongodump --uri="mongodb+srv://..." --out=backup
```

### 6.3 Update Deployment

**Automatic (Recommended):**
- Push to GitHub main branch
- Vercel/Netlify auto-deploys frontend
- Render auto-deploys backend

**Manual:**
- Vercel: Click "Redeploy" in dashboard
- Render: Click "Manual Deploy" → "Deploy latest commit"

## 🎯 Step 7: Seed Production Database

### 7.1 Connect to Production Database

Update local `.env` temporarily:
```env
MONGO_URL=mongodb+srv://school_admin:PASSWORD@cluster0.xxxxx.mongodb.net/smsproject?retryWrites=true&w=majority
```

### 7.2 Run Seed Script

```bash
cd backend
node scripts/seed-data.js
```

### 7.3 Verify Data

Login to your deployed app and check if data appears.

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Database seeded with initial data
- [ ] All features tested on production
- [ ] Logs checked for errors
- [ ] Custom domain configured (optional)
- [ ] Monitoring setup
- [ ] Backup strategy in place

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

## 📞 Support

If you encounter issues:
1. Check logs in deployment platform
2. Review this guide
3. Check browser console for frontend errors
4. Test API endpoints directly
5. Open an issue on GitHub

---

**Deployment Status:** Ready for Production ✅
