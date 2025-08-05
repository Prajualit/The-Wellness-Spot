// Direct authentication test utility
import axios from 'axios';

export const testAuth = async () => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    const debugToken = localStorage.getItem('debug_accessToken');
    
    console.log('🧪 Direct auth test starting...');
    console.log('- Base URL:', baseURL);
    console.log('- Debug token exists:', !!debugToken);
    console.log('- Debug token length:', debugToken?.length);
    
    if (!debugToken) {
        console.log('❌ No debug token found');
        return false;
    }
    
    try {
        const response = await axios.get(`${baseURL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${debugToken}`,
                'Accept': 'application/json',
            },
            withCredentials: true,
            timeout: 10000
        });
        
        console.log('✅ Direct auth test successful:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Direct auth test failed:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
};
