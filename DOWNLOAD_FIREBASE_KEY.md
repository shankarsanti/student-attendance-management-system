# 🔑 Download Firebase Service Account Key

## ⚠️ IMPORTANT: You Must Do This Manually

I cannot download this file for you. You must do it yourself from Firebase Console.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Firebase Console

**Copy this URL and paste it in your browser:**
```
https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk
```

**OR**

1. Go to: https://console.firebase.google.com
2. Click on your project: "busbook-8e57e"
3. Click the gear icon (⚙️) → "Project settings"
4. Click "Service accounts" tab

---

### Step 2: Generate New Private Key

You will see a page that looks like this:

```
┌─────────────────────────────────────────────────────┐
│  Service accounts                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Firebase Admin SDK                                  │
│                                                      │
│  [Generate new private key]  ← CLICK THIS BUTTON    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Click the "Generate new private key" button**

---

### Step 3: Confirm Download

A popup will appear:

```
┌─────────────────────────────────────────┐
│  Generate new private key?              │
├─────────────────────────────────────────┤
│                                         │
│  This key allows full access to your   │
│  Firebase project. Keep it secure.     │
│                                         │
│  [Cancel]  [Generate key] ← CLICK THIS │
│                                         │
└─────────────────────────────────────────┘
```

**Click "Generate key"**

---

### Step 4: File Downloads

A JSON file will automatically download to your Downloads folder.

The filename will be something like:
```
busbook-8e57e-firebase-adminsdk-xxxxx-xxxxxxxxxx.json
```

---

### Step 5: Rename the File

**Rename the downloaded file to exactly:**
```
serviceAccountKey.json
```

**Important:** 
- The name must be EXACTLY `serviceAccountKey.json`
- Case-sensitive (lowercase 's', capital 'A', capital 'K')
- No spaces
- Must be `.json` extension

---

### Step 6: Move the File

**Move the file to this location:**
```
MERN-School-Management-System/backend/config/serviceAccountKey.json
```

**On Mac/Linux:**
```bash
mv ~/Downloads/serviceAccountKey.json "MERN-School-Management-System/backend/config/"
```

**On Windows:**
```cmd
move %USERPROFILE%\Downloads\serviceAccountKey.json "MERN-School-Management-System\backend\config\"
```

**Or manually:**
1. Open Finder/File Explorer
2. Navigate to your Downloads folder
3. Find the `serviceAccountKey.json` file
4. Drag it to: `MERN-School-Management-System/backend/config/`

---

### Step 7: Verify File Location

**Check that the file exists:**

**On Mac/Linux:**
```bash
ls -la MERN-School-Management-System/backend/config/serviceAccountKey.json
```

**On Windows:**
```cmd
dir "MERN-School-Management-System\backend\config\serviceAccountKey.json"
```

**You should see:**
```
serviceAccountKey.json
```

---

### Step 8: Enable Firestore Database

**Open this URL:**
```
https://console.firebase.google.com/project/busbook-8e57e/firestore
```

**If you see "Create database":**
1. Click "Create database"
2. Select "Start in test mode"
3. Choose a location (e.g., "us-central1")
4. Click "Enable"

**If Firestore is already enabled:**
- You're done! Skip to Step 9

---

### Step 9: Restart Backend

The backend will automatically detect the new file.

**If it doesn't restart automatically:**
1. Go to the terminal running the backend
2. Press `Ctrl+C` to stop it
3. Run: `npm start`

---

### Step 10: Verify Connection

**Check the backend terminal. You should see:**
```
✅ Connected to Firebase Firestore
Server started at port no. 5001
```

**Instead of:**
```
⚠️  FIREBASE NOT CONNECTED  ⚠️
```

---

## ✅ After Setup

Once the file is in place:

### Create Admin Account
```bash
cd backend
node scripts/create-admin.js
```

### Login
1. Open: http://localhost:3000
2. Click "Login" → "Admin"
3. Email: `admin@school.com`
4. Password: `admin123`

---

## 🆘 Troubleshooting

### "I can't find the downloaded file"
- Check your Downloads folder
- Look for files starting with "busbook-8e57e"
- The file might be in a different download location

### "The file won't rename"
- Make sure you're showing file extensions
- On Mac: Finder → Preferences → Advanced → Show all filename extensions
- On Windows: File Explorer → View → File name extensions

### "I get permission denied"
- Make sure you have write permissions to the folder
- Try running your terminal/command prompt as administrator

### "Backend still shows NOT CONNECTED"
- Double-check the filename is exactly `serviceAccountKey.json`
- Make sure it's in the `backend/config/` folder
- Restart the backend server

---

## 🔒 Security Warning

**NEVER:**
- ❌ Commit this file to git
- ❌ Share this file publicly
- ❌ Upload it to GitHub
- ❌ Send it in emails

**The file is already in `.gitignore` to prevent accidental commits.**

---

## 📞 Need Help?

If you're stuck:
1. Check the file is named correctly
2. Check the file is in the right folder
3. Check Firestore is enabled
4. Restart the backend server
5. Check backend terminal for error messages

---

**🔥 This is the ONLY way to connect to Firebase. There is no workaround.**
