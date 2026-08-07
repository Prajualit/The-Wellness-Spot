// Direct authentication test utility
import axios from 'axios';

export const testAuth = async () => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

    try {
        const response = await axios.get(`${baseURL}/users/me`, {
            withCredentials: true,
            timeout: 10000
        });

        return response.status >= 200 && response.status < 300;
    } catch (error) {
        return false;
    }
};
