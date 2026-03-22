const jwt = require('jsonwebtoken');

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Check if user is teacher
const isTeacher = (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Access denied. Teacher only.' });
    }
    next();
};

// Check if user is student
const isStudent = (req, res, next) => {
    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Access denied. Student only.' });
    }
    next();
};

// Check if user is admin or teacher
const isAdminOrTeacher = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Access denied. Admin or Teacher only.' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isTeacher,
    isStudent,
    isAdminOrTeacher
};
