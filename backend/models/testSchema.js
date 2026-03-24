const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    type: {
        type: String,
        enum: ['Quiz', 'Mid-term', 'Final', 'Assignment', 'Other'],
        default: 'Quiz'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    results: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
        },
        marksObtained: {
            type: Number,
            default: 0
        },
        remarks: {
            type: String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("test", testSchema);
