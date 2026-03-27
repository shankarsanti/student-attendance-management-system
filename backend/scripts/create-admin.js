const bcrypt = require('bcrypt');
const { initializeFirebase } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');

// Admin credentials
const adminCredentials = {
    name: 'Admin User',
    email: 'admin@school.com',
    password: 'admin123',
    schoolName: 'Demo School',
    role: 'Admin',
    isActive: true
};

const createAdmin = async () => {
    try {
        console.log('🔄 Initializing Firebase...');
        const db = initializeFirebase();
        
        console.log('🔄 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
        
        console.log('🔄 Creating admin account...');
        const adminData = {
            ...adminCredentials,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Check if admin already exists
        const existingAdmins = await db.collection(COLLECTIONS.ADMINS)
            .where('email', '==', adminCredentials.email)
            .get();
        
        if (!existingAdmins.empty) {
            console.log('⚠️  Admin account already exists!');
            console.log('\n📧 Email:', adminCredentials.email);
            console.log('🔑 Password:', adminCredentials.password);
            process.exit(0);
        }
        
        const docRef = await db.collection(COLLECTIONS.ADMINS).add(adminData);
        
        console.log('✅ Admin account created successfully!');
        console.log('\n=================================');
        console.log('📧 Email:', adminCredentials.email);
        console.log('🔑 Password:', adminCredentials.password);
        console.log('🏫 School Name:', adminCredentials.schoolName);
        console.log('👤 Name:', adminCredentials.name);
        console.log('🆔 Admin ID:', docRef.id);
        console.log('=================================\n');
        console.log('🌐 Login at: http://localhost:3000');
        console.log('1. Click "Login"');
        console.log('2. Select "Admin"');
        console.log('3. Enter the email and password above');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        console.log('\n⚠️  Make sure you have:');
        console.log('1. Downloaded serviceAccountKey.json from Firebase Console');
        console.log('2. Placed it in backend/config/serviceAccountKey.json');
        console.log('3. Enabled Firestore database in Firebase Console');
        process.exit(1);
    }
};

createAdmin();
