// Direct authentication test utility
import axios from 'axios';
import { getApiBaseURL } from '../lib/apiConfig.js';

export const testAuth = async () => {
    const baseURL = getApiBaseURL();

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
