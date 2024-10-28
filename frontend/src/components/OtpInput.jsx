import React, { useState } from 'react';

const OTPInput = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [id, setId] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 3) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
        if (value === '' && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
        setError('');
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        try {
            const response = await fetch('http://localhost:5000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otpString, id: parseInt(id) }),
            });
            const data = await response.json();
            if (!data.success) {
                setError(data.message);
                setIsSubmitted(true);
                // Disable the button for 15 seconds
                setIsButtonDisabled(true);
                setTimeout(() => {
                    setIsButtonDisabled(false);
                }, 15000); // 15 seconds
            } else {
                alert(data.message); // Handle successful verification
                setUserData(data.user); // Store the user data for display
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
            <input
                type="number"
                placeholder="Enter your ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="border rounded-lg p-4 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <div className="flex space-x-2 mb-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        maxLength={1}
                        className={`border rounded-lg p-4 text-center w-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isSubmitted && error ? 'animate-shake border-red-500' : ''}`}
                    />
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={otp.includes('') || isButtonDisabled}
                className={`bg-blue-600 text-white rounded-lg p-4 w-full transition duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Verify
            </button>
            {isSubmitted && error && <div className="text-red-500 mt-2">{error}</div>}
            {userData && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <h3 className="font-semibold">User Data:</h3>
                    <p>ID: {userData.id}</p>
                    <p>Username: {userData.username}</p>
                    <p>Name: {userData.name}</p>
                </div>
            )}
        </div>
    );
};

export default OTPInput;