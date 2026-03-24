// Script to check student fee status
// Run with: node scripts/check-student-fees.js

const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('../models/studentSchema');
const FeeStructure = require('../models/feeStructureSchema');
const FeePayment = require('../models/feePaymentSchema');
const Sclass = require('../models/sclassSchema');

async function checkStudentFees() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get all students
        const students = await Student.find().populate('sclassName');
        console.log(`\n📊 Found ${students.length} students`);

        if (students.length === 0) {
            console.log('❌ No students found. Please create students first.');
            process.exit(1);
        }

        // Check each student's fee status
        for (const student of students) {
            console.log(`\n👤 Student: ${student.name} (Roll: ${student.rollNum})`);
            console.log(`   Class: ${student.sclassName?.sclassName || 'N/A'}`);
            console.log(`   ID: ${student._id}`);

            // Get fee structures for this student's class
            const feeStructures = await FeeStructure.find({
                $or: [
                    { class: student.sclassName?._id },
                    { class: null }
                ],
                school: student.school
            });

            console.log(`   Fee Structures: ${feeStructures.length}`);

            if (feeStructures.length === 0) {
                console.log('   ⚠️  No fee structure assigned');
                continue;
            }

            // Get payments for this student
            const payments = await FeePayment.find({ student: student._id });
            console.log(`   Payments Made: ${payments.length}`);

            // Calculate fee status
            let totalFee = 0;
            let totalPaid = 0;

            for (const fee of feeStructures) {
                const paidForThisFee = payments
                    .filter(p => p.feeStructure.toString() === fee._id.toString())
                    .reduce((sum, p) => sum + p.amountPaid, 0);
                
                totalFee += fee.amount;
                totalPaid += paidForThisFee;

                console.log(`   📝 ${fee.feeName}: ₹${fee.amount} (Paid: ₹${paidForThisFee})`);
            }

            const pending = totalFee - totalPaid;
            console.log(`   💰 Total Fee: ₹${totalFee}`);
            console.log(`   ✅ Total Paid: ₹${totalPaid}`);
            console.log(`   ⏳ Pending: ₹${pending}`);
            
            if (pending > 0) {
                console.log('   🔴 Status: PENDING - Can make payment');
            } else if (pending === 0 && totalFee > 0) {
                console.log('   🟢 Status: FULLY PAID');
            } else {
                console.log('   ⚪ Status: NO FEE ASSIGNED');
            }
        }

        console.log('\n📝 Summary:');
        console.log('   - If student shows "FULLY PAID", they cannot make payment');
        console.log('   - If student shows "NO FEE ASSIGNED", admin needs to create fee structure');
        console.log('   - If student shows "PENDING", they can make payment');
        console.log('\n💡 To test payment feature:');
        console.log('   1. Admin: Create a fee structure with amount > 0');
        console.log('   2. Admin: Assign it to student\'s class');
        console.log('   3. Student: Login and go to Fee Payment page');
        console.log('   4. Student: Click "Make Payment" button');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkStudentFees();
