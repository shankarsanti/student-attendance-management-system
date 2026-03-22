const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile
} = require('../controllers/auth-controller');

// Password reset request (no auth required)
router.post('/request-password-reset', requestPasswordReset);

// Reset password with token (no auth required)
router.post('/reset-password', resetPassword);

// Change password (requires authentication)
router.post('/change-password', verifyToken, changePassword);

// Update profile (requires authentication)
router.put('/update-profile', verifyToken, updateProfile);

// Admin-only profile update
router.put('/admin/update-profile/:id', verifyToken, isAdmin, updateProfile);

module.exports = router;
