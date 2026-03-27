# 🚀 Quick Start Guide

## ⚠️ Current Issue: Network Error

You're seeing "Network Error" because **Firebase is not connected**.

---

## ✅ Solution: Connect Firebase (3 Steps)

### Step 1: Download Service Account Key

1. **Click this link:**
   ```
   https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
   ```

2. **Click the button:** "Generate new private key"

3. **Confirm:** Click "Generate key" in the popup

4. **A JSON file will download** (something like `student-management-syste-f3ff5-firebase-adminsdk-xxxxx.json`)

### Step 2: Place the File

1. **Rename** the downloaded file to: `serviceAccountKey.json`

2. **Move it** to this location:
   ```
   MERN-School-Management-System/backend/config/serviceAccountKey.json
   ```

   Your folder should look like:
   ```
   backend/
     config/
       firebase.js
       serviceAccountKey.json  ← Put it here!
       .gitkeep
   ```

### Step 3: Enable Firestore Database

1. **Click this link:**
   ```
   https://console.firebase.google.com/project/busbook-8e57e/firestore
   ```

2. If you see **"Create database"**, click it

3. Select **"Start in test mode"**

4. Choose a location (e.g., "us-central1")

5. Click **"Enable"**

---

## 🎉 After Setup

The backend will **automatically reconnect** to Firebase!

Then you can:

### Create Admin Account

```bash
cd backend
node scripts/create-admin.js
```

### Login Credentials

- **Email:** admin@school.com
- **Password:** admin123

### Login Steps

1. Open: http://localhost:3000
2. Click "Login"
3. Select "Admin"
4. Enter email and password
5. Click "Login"

---

## 🔍 Verify Setup

After placing the file, check backend terminal. You should see:
```
✅ Connected to Firebase Firestore
Server started at port no. 5001
```

Instead of:
```
⚠️  FIREBASE NOT CONNECTED  ⚠️
```

---

## 📱 Current Status

- ✅ Frontend running: http://localhost:3000
- ✅ Backend running: http://localhost:5001
- ❌ Firebase NOT connected (causing Network Error)

---

## 🆘 Still Having Issues?

1. **Check file name:** Must be exactly `serviceAccountKey.json`
2. **Check location:** Must be in `backend/config/` folder
3. **Check Firestore:** Must be enabled in Firebase Console
4. **Restart backend:** Stop and start the backend server
5. **Check terminal:** Look for error messages in backend terminal

---

## 📚 More Help

- See `ADMIN_CREDENTIALS.txt` for login details
- See `HOW_TO_FIX_ADMIN_REGISTRATION.md` for detailed Firebase setup
- See `PROJECT_STRUCTURE.md` for project overview

---

**🔥 Download the Firebase key to fix the Network Error!**
