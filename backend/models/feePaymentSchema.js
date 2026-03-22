const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    feeStructure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feeStructure',
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Online', 'Cheque', 'Bank Transfer'],
        default: 'Cash'
    },
    transactionId: {
        type: String
    },
    status: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending'],
        default: 'Paid'
    },
    remarks: {
        type: String
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    receivedBy: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("feePayment", feePaymentSchema);
