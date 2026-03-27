const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { queryDocuments, getDocumentById, updateDocument } = require('../models/firebase/helpers');

const generateToken = (user, role) => {
    return jwt.sign(
        { id: user.id, role: role, email: user.email || user.rollNum },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const requestPasswordReset = async (req, res) => {
    const { email, role } = req.body;
    try {
        let users, collection;
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
            users = await queryDocuments(collection, [{ field: 'email', operator: '==', value: email }]);
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
            users = await queryDocuments(collection, [{ field: 'email', operator: '==', value: email }]);
        } else {
            return res.status(400).json({ message: 'Invalid role for password reset' });
        }
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        await updateDocument(collection, user.id, {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: Date.now() + 3600000
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        res.json({ message: 'Password reset token generated', resetToken: resetToken, resetUrl: resetUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error requesting password reset' });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword, role } = req.body;
    try {
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const db = getFirestore();
        let collection;
        if (role === 'Admin') {
            collection = COLLECTIONS.ADMINS;
        } else if (role === 'Teacher') {
            collection = COLLECTIONS.TEACHERS;
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const snapshot = await db.collection(collection).where('resetPasswordToken', '==', resetTokenHash).where('resetPasswordExpire', '>', Date.now()).get();
        if (snapshot.empty) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await updateDocument(collection, userId, { password: hashedPassword, resetPasswordToken: null, resetPasswordExpire: null });
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    try {
        let collection;
        if (role === 'Admin') collection = COLLECTIONS.ADMINS;
        else if (role === 'Teacher') collection = COLLECTIONS.TEACHERS;
        else if (role === 'Student') collection = COLLECTIONS.STUDENTS;
        else return res.status(400).json({ message: 'Invalid role' });
        const user = await getDocumentById(collection, userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await updateDocument(collection, userId, { password: hashedPassword });
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const updates = req.body;
    try {
        delete updates.password;
        delete updates.role;
        let collection;
        if (role === 'Admin') collection = COLLECTIONS.ADMINS;
        else if (role === 'Teacher') collection = COLLECTIONS.TEACHERS;
        else if (role === 'Student') collection = COLLECTIONS.STUDENTS;
        else return res.status(400).json({ message: 'Invalid role' });
        await updateDocument(collection, userId, updates);
        const user = await getDocumentById(collection, userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        delete user.password;
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = { generateToken, requestPasswordReset, resetPassword, changePassword, updateProfile };
