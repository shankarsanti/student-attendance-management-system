const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Initialize Firebase Admin SDK
let db;
let firebaseInitialized = false;
let initializationError = null;

const initializeFirebase = () => {
    try {
        // Check if already initialized
        if (firebaseInitialized && db) {
            return db;
        }

        // For production: use service account key from environment
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        } else {
            // For development: check if service account file exists
            const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
            
            if (!fs.existsSync(serviceAccountPath)) {
                const errorMsg = `
╔════════════════════════════════════════════════════════════════╗
║                  ⚠️  FIREBASE NOT CONNECTED  ⚠️                 ║
╚════════════════════════════════════════════════════════════════╝

Missing file: backend/config/serviceAccountKey.json

📥 TO FIX THIS:

1. Download the service account key from Firebase Console:
   https://console.firebase.google.com/project/busbook-8e57e/settings/serviceaccounts/adminsdk

2. Click "Generate new private key"

3. Save the downloaded file as:
   backend/config/serviceAccountKey.json

4. Enable Firestore database:
   https://console.firebase.google.com/project/busbook-8e57e/firestore

5. Restart the backend server

⚠️  Backend is running but database operations will fail!
                `;
                console.error(errorMsg);
                initializationError = new Error('Firebase not configured. Please add serviceAccountKey.json');
                throw initializationError;
            }

            const serviceAccount = require('./serviceAccountKey.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }

        db = admin.firestore();
        firebaseInitialized = true;
        console.log('✅ Connected to Firebase Firestore');
        return db;
    } catch (error) {
        initializationError = error;
        console.error('❌ Error initializing Firebase:', error.message);
        throw error;
    }
};

const getFirestore = () => {
    if (!db) {
        return initializeFirebase();
    }
    return db;
};

const isFirebaseConnected = () => {
    return firebaseInitialized && db !== null;
};

module.exports = { admin, getFirestore, initializeFirebase, isFirebaseConnected };
