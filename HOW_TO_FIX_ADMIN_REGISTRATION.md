# 🔧 How to Fix Admin Registration

## The Problem

Admin registration is not working because Firebase is not connected.

**Error:** `Cannot find module './serviceAccountKey.json'`

## ✅ The Solution (Must Do This!)

You **MUST** download the real Firebase service account key from Google Firebase Console. There's no workaround.

### Step-by-Step Instructions:

#### 1. Open Firebase Console

Click this link (or copy to browser):
```
https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
```

#### 2. Generate Service Account Key

1. You'll see a page titled "Service accounts"
2. Look for a button that says **"Generate new private key"**
3. Click it
4. A popup will appear asking "Generate new private key?"
5. Click **"Generate key"**

#### 3. Download the File

- A JSON file will automatically download
- The filename will be something like:
  ```
  student-management-syste-f3ff5-firebase-adminsdk-xxxxx-xxxxxxxxxx.json
  ```

#### 4. Rename the File

- Rename the downloaded file to exactly:
  ```
  serviceAccountKey.json
  ```
- **Important**: The name must be exact (case-sensitive)

#### 5. Move the File

Move `serviceAccountKey.json` to:
```
MERN-School-Management-System/backend/config/serviceAccountKey.json
```

Your folder structure should look like:
```
backend/
  config/
    firebase.js
    serviceAccountKey.json  ← The file you just downloaded
    .gitkeep
```

#### 6. Enable Firestore Database

1. Open this link:
   ```
   https://console.firebase.google.com/project/busbook-8e57e/firestore
   ```

2. If you see "Create database" button, click it

3. Select **"Start in test mode"**

4. Choose a location (e.g., "us-central1")

5. Click **"Enable"**

#### 7. Restart Backend

The backend server will automatically detect the new file and reconnect.

If it doesn't restart automatically:
- Stop the backend (Ctrl+C in terminal)
- Run: `npm start` in the backend folder

### After Setup

Once you complete these steps:
- ✅ Admin registration will work
- ✅ Admin login will work  
- ✅ All database operations will work

## Verification

To verify the file is in the right place, run:
```bash
ls -la backend/config/
```

You should see:
```
serviceAccountKey.json
```

## ⚠️ Security Warning

**NEVER commit this file to git!**

The file is already in `.gitignore`, but double-check:
- Don't share this file publicly
- Don't upload it to GitHub
- Don't send it in emails

## Still Not Working?

If you've done all the above and it still doesn't work:

1. Check the file is named exactly `serviceAccountKey.json`
2. Check it's in the `backend/config/` folder
3. Check Firestore is enabled in Firebase Console
4. Restart the backend server
5. Check backend logs for errors

## Why This is Required

Firebase requires a valid service account key to:
- Authenticate with Google's servers
- Access Firestore database
- Perform CRUD operations
- Manage user authentication

There's no way around this - you must download the real key from Firebase Console.

---

**Download the key from Firebase Console to make admin registration work!**
