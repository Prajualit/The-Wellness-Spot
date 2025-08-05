import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

console.log('🌐 Axios Configuration:', {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  nodeEnv: process.env.NODE_ENV,
  windowLocation: typeof window !== 'undefined' ? window.location.href : 'server-side'
});

// Simple function to redirect to login (only if not already there)
function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

instance.interceptors.request.use(
  (config) => {
    // Skip auth check for public endpoints and login page
    const publicEndpoints = ["/users/login", "/users/register", "/health"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );
    const isOnLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    if (isPublicEndpoint || isOnLoginPage) {
      return config;
    }

    // DEBUG FALLBACK: If no cookies are available, try to use localStorage token
    if (typeof window !== "undefined") {
      const debugToken = localStorage.getItem('debug_accessToken');
      if (debugToken && !config.headers.Authorization) {
        console.log('🔧 Using debug token from localStorage');
        config.headers.Authorization = `Bearer ${debugToken}`;
      }
    }

    // For httpOnly cookies, we can't check them in JS, so let the request proceed
    // The backend will handle auth validation
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Add debugging for login responses to check cookies
    if (response.config?.url?.includes('/login')) {
      console.log('🔐 LOGIN RESPONSE Debug:');
      console.log('- Response headers:', response.headers);
      console.log('- Set-Cookie headers:', response.headers['set-cookie']);
      console.log('- Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
      console.log('- Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
      console.log('- Document cookies after response:', document.cookie);
    }
    return response;
  },
  (error) => {
    // Add debugging for CORS errors
    if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
      console.error('❌ NETWORK/CORS Error:', {
        status: error.response?.status,
        code: error.code,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          withCredentials: error.config?.withCredentials
        }
      });
    }
    
    // If 401 and not a public endpoint and not on login page, redirect to login
    if (error.response?.status === 401) {
      const publicEndpoints = ["/users/login", "/users/register", "/health"];
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        error.config?.url?.includes(endpoint)
      );
      const isOnLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

      if (!isPublicEndpoint && !isOnLoginPage) {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
