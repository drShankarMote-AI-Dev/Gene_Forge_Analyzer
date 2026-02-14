const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, sendAdminOtp, verifyAdminOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Admin Routes
router.post('/admin/send-otp', sendAdminOtp);
router.post('/admin/verify-otp', verifyAdminOtp);

module.exports = router;
