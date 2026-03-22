const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/adminSchema');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');

// Generate JWT token
const generateToken = (user, role) => {
    return jwt.sign(
        { id: user._id, role: role, email: user.email || user.rollNum },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Password reset request
const requestPasswordReset = async (req, res) => {
    const { email, role } = req.body;

    try {
        let user;
        let Model;

        if (role === 'Admin') {
            Model = Admin;
            user = await Admin.findOne({ email });
        } else if (role === 'Teacher') {
            Model = Teacher;
            user = await Teacher.findOne({ email });
        } else {
            return res.status(400).json({ message: 'Invalid role for password reset' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save reset token and expiry (1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        // In production, send email with reset link
        // For now, return the token (in production, this should be sent via email)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        res.json({
            message: 'Password reset token generated',
            resetToken: resetToken, // Remove this in production
            resetUrl: resetUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error requesting password reset' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword, role } = req.body;

    try {
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        let user;
        let Model;

        if (role === 'Admin') {
            Model = Admin;
            user = await Admin.findOne({
                resetPasswordToken: resetTokenHash,
                resetPasswordExpire: { $gt: Date.now() }
            });
        } else if (role === 'Teacher') {
            Model = Teacher;
            user = await Teacher.findOne({
                resetPasswordToken: resetTokenHash,
                resetPasswordExpire: { $gt: Date.now() }
            });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

// Change password (for logged-in users)
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    try {
        let user;
        let Model;

        if (role === 'Admin') {
            Model = Admin;
            user = await Admin.findById(userId);
        } else if (role === 'Teacher') {
            Model = Teacher;
            user = await Teacher.findById(userId);
        } else if (role === 'Student') {
            Model = Student;
            user = await Student.findById(userId);
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const updates = req.body;

    try {
        let user;
        let Model;

        // Don't allow password update through this endpoint
        delete updates.password;
        delete updates.role;

        if (role === 'Admin') {
            Model = Admin;
            user = await Admin.findByIdAndUpdate(userId, updates, { new: true });
        } else if (role === 'Teacher') {
            Model = Teacher;
            user = await Teacher.findByIdAndUpdate(userId, updates, { new: true });
        } else if (role === 'Student') {
            Model = Student;
            user = await Student.findByIdAndUpdate(userId, updates, { new: true });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = undefined;
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = {
    generateToken,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile
};
