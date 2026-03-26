# 🚀 Quick Deployment Guide

## Before You Deploy

Run the deployment checker:
```bash
./check-deployment.sh
```

## 3-Step Deployment Process

### Step 1: Commit Your Code ✅

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend (5 minutes) 🔧

1. Go to https://render.com
2. Sign in with GitHub
3. Click **New +** → **Web Service**
4. Select your repository
5. Configure:
   - **Name:** school-management-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   ```
   MONGO_URL=your_mongodb_connection_string
   PORT=5001
   SECRET_KEY=your_secret_key
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-app.vercel.app
   ```
7. Click **Create Web Service**
8. **Copy your backend URL** (e.g., https://school-management-backend.onrender.com)

### Step 3: Deploy Frontend (3 minutes) 🎨

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Import your repository
5. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Add Environment Variable:
   - **Name:** `REACT_APP_BASE_URL`
   - **Value:** Your backend URL from Step 2
7. Click **Deploy**
8. Wait 2-3 minutes
9. **Copy your frontend URL** (e.g., https://your-app.vercel.app)

### Step 4: Update Backend FRONTEND_URL 🔄

1. Go back to Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Click **Save Changes**
6. Service will auto-redeploy

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Try logging in:
   - Admin: admin@12 / admin
   - Teacher: teacher@12 / teacher
   - Student: student@12 / student
3. Check browser console (F12) for errors
4. Test key features:
   - Dashboard loads
   - Fee payment works
   - Tests and lessons display

## 🐛 Getting 404 Error?

Read: `VERCEL_DEPLOYMENT_FIX.md`

Quick fixes:
1. Make sure `vercel.json` is committed
2. Redeploy on Vercel
3. Check environment variables are set
4. Verify backend is running

## 📚 Need More Help?

- **Detailed Guide:** Read `DEPLOYMENT_GUIDE.md`
- **404 Errors:** Read `VERCEL_DEPLOYMENT_FIX.md`
- **General Info:** Read `README.md`

## 🎯 Environment Variables Cheat Sheet

### Backend (.env on Render)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/smsproject
PORT=5001
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env on Vercel)
```env
REACT_APP_BASE_URL=https://your-backend.onrender.com
```

## 💡 Pro Tips

1. **Test locally first:**
   ```bash
   cd frontend && npm run build
   ```

2. **Check logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Logs

3. **Redeploy easily:**
   - Just push to GitHub, both platforms auto-deploy

4. **Use MongoDB Atlas:**
   - Free tier available
   - Better than local MongoDB for production
   - Follow DEPLOYMENT_GUIDE.md for setup

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| 404 Error | Check `vercel.json` exists, redeploy |
| CORS Error | Update backend CORS with frontend URL |
| Blank Page | Check browser console, verify API URL |
| Build Failed | Test `npm run build` locally first |
| API Not Working | Verify `REACT_APP_BASE_URL` is set |

---

**Total Time:** ~10 minutes
**Difficulty:** Easy
**Cost:** Free (using free tiers)
