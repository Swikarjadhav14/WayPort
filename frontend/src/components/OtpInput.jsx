import React, { useState } from 'react';
import { verifyOtp } from '../services/authService';

const OtpInput = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp('1234567890', otp);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('OTP verification failed');
        }
    };

    return (
        <div>
            <h1>Enter OTP</h1>
            <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
            />
            <button onClick={handleSubmit}>Verify OTP</button>
            <p>{message}</p>
        </div>
    );
};

export default OtpInput;
