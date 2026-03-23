const router = require('express').Router();
const { forgotPassword, resetPassword, resetStudentPassword } = require('../controllers/password-controller.js');
const { verifyToken } = require('../middleware/auth.js');

// Public route - anyone can request password reset
router.post('/forgot-password', forgotPassword);

// Protected routes - only admin can reset passwords
router.post('/reset-password', verifyToken, resetPassword);
router.post('/reset-student-password', verifyToken, resetStudentPassword);

module.exports = router;
