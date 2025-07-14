// Simple API connectivity test
import axios from '@/lib/axios';

export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    
    const response = await axios.get('/health', {
      timeout: 10000, // 10 seconds for health check
    });
    
    console.log('✅ API Health Check Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return { 
      success: false, 
      error: error.message, 
      code: error.code,
      status: error.response?.status 
    };
  }
};

export const testValidateEndpoint = async () => {
  try {
    console.log('🔍 Testing validate endpoint...');
    
    const response = await axios.post('/users/validate', {
      name: 'Test User',
      phone: '9999999999'
    }, {
      timeout: 15000,
    });
    
    console.log('✅ Validate Endpoint Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Validate Endpoint Failed:', error);
    return { 
      success: false, 
      error: error.message, 
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data
    };
  }
};
