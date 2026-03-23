const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

// Forgot Password - Creates a password reset request
const forgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        let user;
        let Model;

        // Find user based on role
        switch (role) {
            case 'Admin':
                Model = Admin;
                user = await Admin.findOne({ email });
                break;
            case 'Teacher':
                Model = Teacher;
                user = await Teacher.findOne({ email });
                break;
            case 'Student':
                // Students don't have email, so we'll handle this differently
                return res.status(400).json({ 
                    message: 'Students should contact their administrator for password reset using their Roll Number and Name.' 
                });
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // In a production environment, you would:
        // 1. Generate a reset token
        // 2. Save it to the database with expiration
        // 3. Send an email with reset link
        
        // For this school system, we'll create a simple notification
        res.status(200).json({ 
            message: 'Password reset request received. Please contact your administrator with your email address to reset your password.',
            email: email,
            role: role
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset Password - Admin can reset user passwords
const resetPassword = async (req, res) => {
    try {
        const { email, role, newPassword } = req.body;

        if (!email || !role || !newPassword) {
            return res.status(400).json({ message: 'Email, role, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        let user;
        let Model;

        // Find user based on role
        switch (role) {
            case 'Admin':
                Model = Admin;
                user = await Admin.findOne({ email });
                break;
            case 'Teacher':
                Model = Teacher;
                user = await Teacher.findOne({ email });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ 
            message: 'Password reset successfully',
            email: email
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset Student Password - Admin can reset student passwords
const resetStudentPassword = async (req, res) => {
    try {
        const { rollNum, studentName, newPassword } = req.body;

        if (!rollNum || !studentName || !newPassword) {
            return res.status(400).json({ message: 'Roll number, name, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find student
        const student = await Student.findOne({ 
            rollNum: rollNum,
            name: studentName 
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found with this roll number and name' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        student.password = hashedPassword;
        await student.save();

        res.status(200).json({ 
            message: 'Student password reset successfully',
            rollNum: rollNum,
            name: studentName
        });

    } catch (error) {
        console.error('Reset student password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
    resetStudentPassword
};
