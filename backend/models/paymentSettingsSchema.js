const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
        unique: true
    },
    upiId: {
        type: String,
        default: ''
    },
    qrCodeImage: {
        type: String, // Base64 encoded image or URL
        default: ''
    },
    phonePeEnabled: {
        type: Boolean,
        default: false
    },
    phonePeNumber: {
        type: String,
        default: ''
    },
    paytmEnabled: {
        type: Boolean,
        default: false
    },
    paytmNumber: {
        type: String,
        default: ''
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branch: String
    },
    instructions: {
        type: String,
        default: 'Please make payment and submit the transaction details.'
    }
}, { timestamps: true });

module.exports = mongoose.model("paymentSettings", paymentSettingsSchema);
