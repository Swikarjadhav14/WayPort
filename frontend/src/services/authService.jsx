import axios from 'axios';

const API_URL = '/api/auth';

export const verifyOtp = (phoneNumber, otp) => {
    return axios.post(`${API_URL}/verify-otp`, { phoneNumber, otp });
};
