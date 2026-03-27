const bcrypt = require('bcrypt');
const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    getDocumentById, 
    queryDocuments, 
    updateDocument
} = require('../models/firebase/helpers');

// Forgot password (for public password reset requests)
const forgotPassword = async (req, res) => {
    const { email, role } = req.body;

    try {
        let collection;
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
        } else if (role === 'Student') {
            collection = COLLECTIONS.STUDENTS;
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
        } else {
            return res.status(400).send({ message: 'Invalid role' });
        }

        const users = await queryDocuments(collection, [
            { field: 'email', operator: '==', value: email }
        ]);

        if (users.length === 0) {
            return res.send({ message: 'User not found' });
        }

        // In a real application, you would send a password reset email here
        // For now, we'll just return a success message
        res.send({ 
            message: 'Password reset instructions sent to email',
            userId: users[0].id 
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json(err);
    }
};

// Change password for authenticated user
const changePassword = async (req, res) => {
    const { userId, role, oldPassword, newPassword } = req.body;

    try {
        let collection;
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
        } else if (role === 'Student') {
            collection = COLLECTIONS.STUDENTS;
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
        } else {
            return res.status(400).send({ message: 'Invalid role' });
        }

        const user = await getDocumentById(collection, userId);

        if (!user) {
            return res.send({ message: 'User not found' });
        }

        // Verify old password
        const validated = await bcrypt.compare(oldPassword, user.password);

        if (!validated) {
            return res.send({ message: 'Incorrect old password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateDocument(collection, userId, {
            password: hashedPassword
        });

        res.send({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json(err);
    }
};

// Reset password (for forgot password functionality)
const resetPassword = async (req, res) => {
    const { email, role, newPassword } = req.body;

    try {
        let collection;
        let field = 'email';
        
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
        } else if (role === 'Student') {
            collection = COLLECTIONS.STUDENTS;
            // Students might use rollNum instead of email
            if (req.body.rollNum) {
                field = 'rollNum';
            }
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
        } else {
            return res.status(400).send({ message: 'Invalid role' });
        }

        const users = await queryDocuments(collection, [
            { field: field, operator: '==', value: email || req.body.rollNum }
        ]);

        if (users.length === 0) {
            return res.send({ message: 'User not found' });
        }

        const user = users[0];

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateDocument(collection, user.id, {
            password: hashedPassword
        });

        res.send({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json(err);
    }
};

// Reset student password (specific endpoint for students)
const resetStudentPassword = async (req, res) => {
    const { rollNum, studentName, newPassword } = req.body;

    try {
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'rollNum', operator: '==', value: rollNum },
            { field: 'name', operator: '==', value: studentName }
        ]);

        if (students.length === 0) {
            return res.send({ message: 'Student not found' });
        }

        const student = students[0];

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateDocument(COLLECTIONS.STUDENTS, student.id, {
            password: hashedPassword
        });

        res.send({ message: 'Student password reset successfully' });
    } catch (err) {
        console.error('Reset student password error:', err);
        res.status(500).json(err);
    }
};

// Admin reset password for any user
const adminResetPassword = async (req, res) => {
    const { userId, role, newPassword } = req.body;

    try {
        let collection;
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
        } else if (role === 'Student') {
            collection = COLLECTIONS.STUDENTS;
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
        } else {
            return res.status(400).send({ message: 'Invalid role' });
        }

        const user = await getDocumentById(collection, userId);

        if (!user) {
            return res.send({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await updateDocument(collection, userId, {
            password: hashedPassword
        });

        res.send({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Admin reset password error:', err);
        res.status(500).json(err);
    }
};

module.exports = {
    forgotPassword,
    changePassword,
    resetPassword,
    resetStudentPassword,
    adminResetPassword
};
