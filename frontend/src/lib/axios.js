import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Robust cookie reader with error handling
function getCookie(name) {
  try {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  } catch (error) {
    console.warn("Error reading cookie:", error);
    return null;
  }
}

// Helper function to set cookie
function setCookie(name, value, maxAge = 86400) {
  try {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${value}; path=/; secure; sameSite=Strict; max-age=${maxAge}`;
    console.log(`🍪 COOKIE: Set ${name} cookie`);
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}

// Helper function to clear auth cookies
function clearAuthCookies() {
  try {
    if (typeof document === "undefined") return;
    const expiredDate = "Thu, 01 Jan 1970 00:00:00 GMT";
    const cookieOptions = `path=/; expires=${expiredDate}; secure; sameSite=Strict`;

    document.cookie = `accessToken=; ${cookieOptions}`;
    document.cookie = `refreshToken=; ${cookieOptions}`;
    console.log("🧹 COOKIES: Cleared all auth cookies");
  } catch (error) {
    console.error("Error clearing cookies:", error);
  }
}

instance.interceptors.request.use(
  (config) => {
    console.log(`🚀 REQUEST: ${config.method?.toUpperCase()} ${config.url}`);

    // Skip adding auth header for public endpoints
    const publicEndpoints = [
      "/users/login",
      "/users/register",
      "/users/refresh-token",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log("⏭️ REQUEST: Public endpoint, skipping auth header");
      return config;
    }

    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("🔐 REQUEST: Added Authorization header");
    } else {
      console.log("⚠️ REQUEST: No access token found");
    }

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(
      `✅ RESPONSE: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - ${response.status}`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(
      `❌ RESPONSE ERROR: ${originalRequest.method?.toUpperCase()} ${
        originalRequest.url
      } - ${error.response?.status}`,
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }
    );

    // Skip refresh logic for public endpoints
    const publicEndpoints = ["/users/login", "/users/register"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log("⏭️ RESPONSE ERROR: Public endpoint, skipping refresh logic");
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 RESPONSE: 401 detected, attempting token refresh");

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log("⏳ RESPONSE: Already refreshing, queueing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 REFRESH: Attempting to refresh access token");

        // Check if refresh token exists
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the access token
        const response = await instance.post("/users/refresh-token");
        const newAccessToken = response.data.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        console.log("✅ REFRESH: Token refreshed successfully");

        // Update the cookie with new access token
        setCookie("accessToken", newAccessToken, 86400); // 24 hours

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ REFRESH: Token refresh failed:", refreshErr);

        // Process queued requests with error
        processQueue(refreshErr, null);

        // Clear auth cookies
        clearAuthCookies();

        // Try to call logout endpoint (best effort)
        try {
          await instance.post("/users/logout");
          console.log("✅ LOGOUT: Called logout endpoint");
        } catch (logoutErr) {
          console.error(
            "❌ LOGOUT: Failed to call logout endpoint:",
            logoutErr
          );
        }

        // Redirect to login page
        if (typeof window !== "undefined") {
          console.log("🔄 REDIRECT: Redirecting to login page");
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
