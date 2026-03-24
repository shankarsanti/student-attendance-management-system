const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
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
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    lessonNumber: {
        type: Number
    },
    chapter: {
        type: String
    },
    objectives: [{
        type: String
    }],
    materials: [{
        type: String
    }],
    homework: {
        type: String
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
        default: 'Scheduled'
    },
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            default: 'Present'
        }
    }],
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("lesson", lessonSchema);
