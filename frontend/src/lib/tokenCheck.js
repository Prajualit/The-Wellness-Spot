"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios.js";

function isTokenExpired(token) {
  if (!token) return true;

  const payloadBase64 = token.split(".")[1];
  if (!payloadBase64) return true;

  try {
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function clearAuthCookies() {
  // Clear all auth-related cookies
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; sameSite=Strict";
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; sameSite=Strict";
}

export default function TokenCheck() {
  const pathname = usePathname();
  const router = useRouter();
  const isRefreshing = useRef(false);

  const handleLogout = async () => {
    try {
      // Try to call logout endpoint, but don't wait for it if it fails
      await axiosInstance.post("/users/logout");
      console.log("Logout API called successfully");
    } catch (logoutErr) {
      console.error("Logout API failed:", logoutErr);
      // Continue with client-side logout even if API fails
    }

    // Clear cookies and redirect regardless of API response
    clearAuthCookies();
    router.push("/login");
  };

  useEffect(() => {
    if (pathname === "/login" || pathname === "/") {
      console.log("On login page, skipping token check.");
      return;
    }

    const accessToken = getCookie("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      if (isRefreshing.current) return;

      isRefreshing.current = true;
      console.log("Access token expired/missing, attempting refresh...");

      axiosInstance
        .post("/users/refresh-token")
        .then((res) => {
          const newAccessToken = res.data.data.accessToken;
          console.log("Token refreshed successfully");

          // Update the cookie with proper expiration
          document.cookie = `accessToken=${newAccessToken}; path=/; secure; sameSite=Strict; max-age=86400`; // 24 hours
        })
        .catch(async (err) => {
          console.warn(
            "Refresh token expired or failed:",
            err.response?.status,
            err.response?.data
          );

          // Check if it's specifically a 401/403 (unauthorized) or any other refresh failure
          if (
            err.response?.status === 401 ||
            err.response?.status === 403 ||
            !err.response
          ) {
            console.log("Refresh token is invalid, logging out...");
            await handleLogout();
          } else {
            console.error("Unexpected error during token refresh:", err);
            // You might want to handle other errors differently
            await handleLogout();
          }
        })
        .finally(() => {
          isRefreshing.current = false;
        });
    } else {
      console.log("Access token is still valid.");
    }
  }, [pathname, router]);

  return null;
}
