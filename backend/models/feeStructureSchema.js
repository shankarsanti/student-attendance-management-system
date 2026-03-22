const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
    feeName: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        enum: ['Tuition Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Sports Fee', 'Other'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    frequency: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'],
        default: 'Yearly'
    },
    dueDate: {
        type: Date
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("feeStructure", feeStructureSchema);
