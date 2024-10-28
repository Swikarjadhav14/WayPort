const express = require('express');
const { requestOtp, verifyOtp } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to your dashboard!' });
});

module.exports = router;
