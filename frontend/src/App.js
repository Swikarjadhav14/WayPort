import React from 'react';
import OTPInput from './components/OTPInput';
import './styles.css';

function App() {
    return (
        <div className="App flex justify-center items-center h-screen bg-gray-100">
            {/* <h1 className="text-2xl mb-5">Enter OTP</h1> */}
            <OTPInput />
        </div>
    );
}

export default App;