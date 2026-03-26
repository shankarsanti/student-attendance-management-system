// Test MongoDB Atlas connection
// Run with: node scripts/test-mongodb-connection.js

const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');
    console.log('Connection String:', process.env.MONGO_URL.replace(/:[^:@]+@/, ':****@')); // Hide password
    console.log('');

    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('');
        console.log('📊 Connection Details:');
        console.log('   Host:', mongoose.connection.host);
        console.log('   Database:', mongoose.connection.name);
        console.log('   Port:', mongoose.connection.port);
        console.log('   Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
        console.log('');
        console.log('🎉 Connection test passed!');
        console.log('');
        console.log('✅ Your backend should work now. Try:');
        console.log('   1. Restart backend: npm start');
        console.log('   2. Refresh student page');
        console.log('   3. Check if fee structures appear');
        
    } catch (error) {
        console.log('❌ Connection failed!');
        console.log('');
        console.log('Error:', error.message);
        console.log('');
        
        if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
            console.log('🔐 Authentication Error Detected!');
            console.log('');
            console.log('Possible causes:');
            console.log('   1. Wrong username or password');
            console.log('   2. Password contains special characters (needs URL encoding)');
            console.log('   3. Database user doesn\'t exist in MongoDB Atlas');
            console.log('   4. User doesn\'t have proper permissions');
            console.log('');
            console.log('📝 Steps to fix:');
            console.log('   1. Go to MongoDB Atlas → Database Access');
            console.log('   2. Verify user "shankarsanti2005_db_user" exists');
            console.log('   3. If not, create a new user with "Atlas admin" role');
            console.log('   4. Copy the new password');
            console.log('   5. Update backend/.env with new credentials');
            console.log('   6. If password has special chars (@#$%^&+=), URL encode them');
            console.log('   7. Run this test again');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.log('🌐 Network Error Detected!');
            console.log('');
            console.log('Possible causes:');
            console.log('   1. No internet connection');
            console.log('   2. IP address not whitelisted in MongoDB Atlas');
            console.log('   3. Firewall blocking connection');
            console.log('');
            console.log('📝 Steps to fix:');
            console.log('   1. Check your internet connection');
            console.log('   2. Go to MongoDB Atlas → Network Access');
            console.log('   3. Add your IP or use 0.0.0.0/0 (allow all)');
            console.log('   4. Wait 1-2 minutes for changes to apply');
            console.log('   5. Run this test again');
        } else {
            console.log('📝 General troubleshooting:');
            console.log('   1. Check backend/.env file exists');
            console.log('   2. Verify MONGO_URL is set correctly');
            console.log('   3. Check MongoDB Atlas cluster is running (not paused)');
            console.log('   4. Try using local MongoDB instead:');
            console.log('      MONGO_URL=mongodb://127.0.0.1:27017/smsproject');
        }
        
        console.log('');
        console.log('📖 For detailed instructions, see: MONGODB_CONNECTION_FIX.md');
    } finally {
        await mongoose.connection.close();
        console.log('');
        console.log('🔌 Connection closed');
    }
}

testConnection();
