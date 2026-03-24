// Test script to verify payment settings functionality
// Run with: node scripts/test-payment-settings.js

const mongoose = require('mongoose');
require('dotenv').config();

const PaymentSettings = require('../models/paymentSettingsSchema');
const Admin = require('../models/adminSchema');

async function testPaymentSettings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get first admin (school)
        const admin = await Admin.findOne();
        if (!admin) {
            console.log('❌ No admin found. Please create an admin first.');
            process.exit(1);
        }
        console.log('✅ Found admin:', admin.adminName, '(ID:', admin._id, ')');

        // Check if payment settings exist
        let settings = await PaymentSettings.findOne({ school: admin._id });
        
        if (!settings) {
            console.log('⚠️  No payment settings found. Creating default settings...');
            settings = new PaymentSettings({
                school: admin._id,
                upiId: 'test@upi',
                phonePeEnabled: true,
                phonePeNumber: '+91 9876543210',
                paytmEnabled: true,
                paytmNumber: '+91 9876543210',
                instructions: 'Test payment instructions'
            });
            await settings.save();
            console.log('✅ Created default payment settings');
        } else {
            console.log('✅ Payment settings found');
        }

        // Display current settings
        console.log('\n📋 Current Payment Settings:');
        console.log('   School ID:', settings.school);
        console.log('   UPI ID:', settings.upiId || '(not set)');
        console.log('   QR Code:', settings.qrCodeImage ? 'Generated' : '(not set)');
        console.log('   PhonePe Enabled:', settings.phonePeEnabled);
        console.log('   PhonePe Number:', settings.phonePeNumber || '(not set)');
        console.log('   Paytm Enabled:', settings.paytmEnabled);
        console.log('   Paytm Number:', settings.paytmNumber || '(not set)');
        console.log('   Bank Account:', settings.bankDetails?.accountNumber || '(not set)');
        console.log('   Instructions:', settings.instructions || '(not set)');

        // Test update
        console.log('\n🔄 Testing update...');
        settings.upiId = 'updated@upi';
        settings.phonePeEnabled = true;
        settings.phonePeNumber = '+91 1234567890';
        await settings.save();
        console.log('✅ Settings updated successfully');

        // Verify update
        const updatedSettings = await PaymentSettings.findOne({ school: admin._id });
        console.log('✅ Verified update:');
        console.log('   UPI ID:', updatedSettings.upiId);
        console.log('   PhonePe Number:', updatedSettings.phonePeNumber);

        console.log('\n✅ All tests passed!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Start backend server: npm start');
        console.log('   2. Start frontend server: npm start (in frontend folder)');
        console.log('   3. Login as admin and go to Payment Settings');
        console.log('   4. Update payment methods and save');
        console.log('   5. Login as student and check Fee Payment page');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testPaymentSettings();
