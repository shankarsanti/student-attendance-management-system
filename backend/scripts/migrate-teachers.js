// Migration script to add teachSubjects field to existing teachers
// Run this once: node migrate-teachers.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Teacher = require('./models/teacherSchema');

const migrateTeachers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Update all teachers that don't have teachSubjects field
        const result = await Teacher.updateMany(
            { teachSubjects: { $exists: false } },
            { $set: { teachSubjects: [] } }
        );

        console.log(`Migration complete!`);
        console.log(`Updated ${result.modifiedCount} teachers`);
        console.log(`Matched ${result.matchedCount} teachers`);

        // Show sample teacher
        const sampleTeacher = await Teacher.findOne().populate('teachSubjects');
        console.log('\nSample teacher after migration:');
        console.log({
            name: sampleTeacher?.name,
            teachSubject: sampleTeacher?.teachSubject,
            teachSubjects: sampleTeacher?.teachSubjects
        });

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateTeachers();
