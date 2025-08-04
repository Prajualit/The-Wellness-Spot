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
    return response;
  },
  (error) => {
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
