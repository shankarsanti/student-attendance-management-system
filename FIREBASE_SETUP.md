# 🔥 Firebase Setup Instructions

## Your Firebase Project

**Project ID:** `busbook-8e57e`  
**Project Name:** BusBook

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Download Service Account Key

1. **Open this link:**
   ```
   https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
   ```

2. **Click:** "Generate new private key" button

3. **Confirm:** Click "Generate key" in the popup

4. **A JSON file will download** (named like `busbook-8e57e-firebase-adminsdk-xxxxx.json`)

### Step 2: Place the File

1. **Rename** the downloaded file to: `serviceAccountKey.json`

2. **Move it** to this exact location:
   ```
   MERN-School-Management-System/backend/config/serviceAccountKey.json
   ```

   Your folder structure should be:
   ```
   backend/
     config/
       firebase.js
       serviceAccountKey.json  ← PUT IT HERE!
       .gitkeep
   ```

### Step 3: Enable Firestore Database

1. **Open this link:**
   ```
   https://console.firebase.google.com/project/busbook-8e57e/firestore
   ```

2. **If you see "Create database":**
   - Click "Create database"
   - Select "Start in test mode"
   - Choose a location (e.g., "us-central" or closest to you)
   - Click "Enable"

3. **If Firestore is already enabled:**
   - You're good to go!

---

## ✅ Verify Setup

After completing the steps above:

1. **Check backend terminal** - You should see:
   ```
   ✅ Connected to Firebase Firestore
   Server started at port no. 5001
   ```

2. **If you still see the warning:**
   ```
   ⚠️  FIREBASE NOT CONNECTED  ⚠️
   ```
   - Double-check the file name is exactly `serviceAccountKey.json`
   - Make sure it's in the `backend/config/` folder
   - Restart the backend server

---

## 🎯 After Setup

Once Firebase is connected, you can:

### 1. Create Admin Account

```bash
cd backend
node scripts/create-admin.js
```

This will create an admin account with:
- **Email:** admin@school.com
- **Password:** admin123

### 2. Login to the App

1. Open: http://localhost:3000
2. Click "Login"
3. Select "Admin"
4. Enter:
   - Email: `admin@school.com`
   - Password: `admin123`
5. Click "Login"

---

## 📋 Current Configuration

### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyD7OBz7kNnZv7-Mo0VwEFg9izifNRSh-9o
REACT_APP_FIREBASE_AUTH_DOMAIN=busbook-8e57e.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=busbook-8e57e
REACT_APP_FIREBASE_STORAGE_BUCKET=busbook-8e57e.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=993069252787
REACT_APP_FIREBASE_APP_ID=1:993069252787:web:81949f65cd10175f40f0c6
REACT_APP_FIREBASE_MEASUREMENT_ID=G-R4XSZ7FBXX
```

### Backend (.env)
```env
FIREBASE_DATABASE_URL=https://busbook-8e57e.firebaseio.com
```

---

## 🔒 Security Notes

- ✅ `serviceAccountKey.json` is already in `.gitignore`
- ⚠️ **NEVER** commit this file to git
- ⚠️ **NEVER** share this file publicly
- ⚠️ Keep it secure on your local machine only

---

## 🆘 Troubleshooting

### Issue: "Cannot find module './serviceAccountKey.json'"

**Solution:**
- Check the file name is exactly `serviceAccountKey.json` (case-sensitive)
- Make sure it's in `backend/config/` folder
- Verify the file is a valid JSON file

### Issue: "Failed to parse private key"

**Solution:**
- The downloaded file might be corrupted
- Download a fresh service account key from Firebase Console
- Make sure you downloaded the correct file (not a different Firebase project)

### Issue: "Permission denied" errors in Firestore

**Solution:**
- Make sure Firestore is enabled
- Check Firestore security rules in Firebase Console
- For development, use "test mode" rules

### Issue: Backend still shows "NOT CONNECTED"

**Solution:**
1. Stop the backend server (Ctrl+C)
2. Verify the file exists: `ls backend/config/serviceAccountKey.json`
3. Start the backend again: `npm start`

---

## 📚 Firebase Console Links

- **Project Overview:** https://console.firebase.google.com/project/busbook-8e57e
- **Service Accounts:** https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
- **Firestore Database:** https://console.firebase.google.com/project/busbook-8e57e/firestore
- **Authentication:** https://console.firebase.google.com/project/busbook-8e57e/authentication
- **Project Settings:** https://console.firebase.google.com/project/busbook-8e57e/settings/general

---

**🔥 Download the service account key to get started!**
