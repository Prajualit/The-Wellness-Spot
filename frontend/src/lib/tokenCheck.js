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

    // Check authentication by calling a protected endpoint
    axiosInstance
      .get("/users/me") // Change to your actual user info endpoint if different
      .then((res) => {
        // User is authenticated, do nothing
        localStorage.setItem("debug_authCheck", "success");
      })
      .catch(async (err) => {
        // Not authenticated, redirect to login
        localStorage.setItem("debug_authCheck", JSON.stringify({
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        }));
        await handleLogout();
      });
  }, [pathname, router]);

  return null;
}
