const sendSms = (phoneNumber, otp) => {
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
    // Use Twilio or other SMS services to send the OTP here
};

module.exports = sendSms;
