"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // To detect current route
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

export default function TokenCheck() {
  const pathname = usePathname();

  useEffect(() => {
    // Only check tokens on protected pages, not on /login
    if (pathname === "/login") {
      console.log("On login page, skipping token check.");
      return;
    }

    const accessToken = getCookie("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      console.log("Access token expired or missing. Attempting to refresh...");

      axiosInstance
        .post("/users/refresh-token")
        .then((res) => {
          console.log(
            "Token refreshed successfully:",
            res.data.data.accessToken
          );
        })
        .catch(async (err) => {
          console.warn("Refresh token expired or failed. Logging out...");
          try {
            await axiosInstance.post("/users/logout");
          } catch (logoutErr) {
            console.error("Logout failed:", logoutErr);
          }
          window.location.href = "/login";
        });
    } else {
      console.log("Access token is still valid.");
    }
  }, [pathname]); // Runs again on page change

  return null;
}
