# ✅ Setup Checklist

## Current Status

- ✅ MongoDB removed
- ✅ Firebase code implemented
- ✅ All 13 controllers converted
- ✅ Frontend running (http://localhost:3000)
- ✅ Backend running (http://localhost:5001)
- ❌ Firebase NOT connected

---

## What You Need to Do

### [ ] Step 1: Download Firebase Key

1. Open: https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Click "Generate key" to confirm
4. File downloads to your Downloads folder

### [ ] Step 2: Rename File

Rename the downloaded file to:
```
serviceAccountKey.json
```

### [ ] Step 3: Move File

Move it to:
```
MERN-School-Management-System/backend/config/serviceAccountKey.json
```

### [ ] Step 4: Enable Firestore

1. Open: https://console.firebase.google.com/project/busbook-8e57e/firestore
2. Click "Create database"
3. Select "Start in test mode"
4. Click "Enable"

### [ ] Step 5: Verify Connection

Check backend terminal shows:
```
✅ Connected to Firebase Firestore
```

### [ ] Step 6: Create Admin Account

```bash
cd backend
node scripts/create-admin.js
```

### [ ] Step 7: Test Login

1. Go to: http://localhost:3000
2. Click "Login" → "Admin"
3. Email: admin@school.com
4. Password: admin123
5. Click "Login"

---

## Files Created

- ✅ `FIREBASE_SETUP.md` - Detailed setup guide
- ✅ `DOWNLOAD_FIREBASE_KEY.md` - Step-by-step download instructions
- ✅ `QUICK_START_GUIDE.md` - Quick reference
- ✅ `MIGRATION_COMPLETE.md` - Migration summary
- ✅ `ADMIN_CREDENTIALS.txt` - Login credentials
- ✅ `backend/scripts/create-admin.js` - Admin creation script

---

## Why This is Required

Firebase requires a service account key to:
- Authenticate with Google's servers
- Access Firestore database
- Perform CRUD operations
- Manage user data

**There is NO workaround. You MUST download the key from Firebase Console.**

---

## Quick Links

- **Download Key:** https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
- **Enable Firestore:** https://console.firebase.google.com/project/busbook-8e57e/firestore
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001

---

**Once you complete these steps, everything will work!**
