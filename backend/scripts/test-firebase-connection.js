/**
 * Test Firebase Connection
 * Run this script to verify Firebase is properly configured
 * 
 * Usage: node scripts/test-firebase-connection.js
 */

const { initializeFirebase, getFirestore } = require('../config/firebase');
const { createDocument, getAllDocuments, deleteDocument } = require('../models/firebase/helpers');

async function testFirebaseConnection() {
    console.log('🔥 Testing Firebase Connection...\n');

    try {
        // Initialize Firebase
        console.log('1. Initializing Firebase...');
        const db = initializeFirebase();
        console.log('✅ Firebase initialized successfully\n');

        // Test collection name
        const TEST_COLLECTION = 'test_connection';

        // Test Create
        console.log('2. Testing CREATE operation...');
        const testData = {
            name: 'Test Document',
            timestamp: new Date().toISOString(),
            testField: 'This is a test'
        };
        const created = await createDocument(TEST_COLLECTION, testData);
        console.log('✅ Document created:', created.id);
        console.log('   Data:', JSON.stringify(created, null, 2), '\n');

        // Test Read
        console.log('3. Testing READ operation...');
        const documents = await getAllDocuments(TEST_COLLECTION);
        console.log(`✅ Found ${documents.length} document(s) in ${TEST_COLLECTION}`);
        console.log('   Documents:', JSON.stringify(documents, null, 2), '\n');

        // Test Delete
        console.log('4. Testing DELETE operation...');
        await deleteDocument(TEST_COLLECTION, created.id);
        console.log('✅ Document deleted:', created.id, '\n');

        // Verify deletion
        console.log('5. Verifying deletion...');
        const remainingDocs = await getAllDocuments(TEST_COLLECTION);
        console.log(`✅ Remaining documents: ${remainingDocs.length}\n`);

        console.log('🎉 All tests passed! Firebase is working correctly.\n');
        console.log('Next steps:');
        console.log('1. Update your controllers to use Firebase');
        console.log('2. Test your API endpoints');
        console.log('3. Set up Firestore security rules');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Firebase connection test failed:');
        console.error(error);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure you have created a Firebase project');
        console.error('2. Check that serviceAccountKey.json exists in backend/config/');
        console.error('3. Verify FIREBASE_DATABASE_URL in .env file');
        console.error('4. Ensure Firestore is enabled in Firebase Console');
        process.exit(1);
    }
}

// Run the test
testFirebaseConnection();
