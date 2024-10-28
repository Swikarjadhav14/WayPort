const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');
const sendSms = require('../utils/sendSms.js');
const jwt = require('jsonwebtoken');

exports.requestOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOtp();

    let user = await User.findOne({ phoneNumber });
    if (!user) {
        user = new User({ phoneNumber, otp });
    } else {
        user.otp = otp;
    }

    await user.save();
    sendSms(phoneNumber, otp);  // Sending OTP via SMS

    res.json({ message: 'OTP sent successfully!' });
};

exports.verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user || user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'OTP verified successfully!', accessToken });
};
