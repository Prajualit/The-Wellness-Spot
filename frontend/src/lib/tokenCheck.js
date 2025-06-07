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

export default function TokenCheck() {
  const pathname = usePathname();
  const router = useRouter();
  const isRefreshing = useRef(false);

  useEffect(() => {
    if (pathname === "/login" || pathname === "/") {
      console.log("On login page, skipping token check.");
      return;
    }

    const accessToken = getCookie("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      if (isRefreshing.current) return;

      isRefreshing.current = true;
      console.log("Access token expired or missing. Attempting to refresh...");

      axiosInstance
        .post("/users/refresh-token")
        .then((res) => {
          const newAccessToken = res.data.data.accessToken;
          console.log("Token refreshed successfully:", newAccessToken);

          // Update the cookie
          document.cookie = `accessToken=${newAccessToken}; path=/; secure; sameSite=Strict`;
        })
        .catch(async (err) => {
          console.warn("Refresh token expired or failed. Logging out...");
          try {
            await axiosInstance.post("/users/logout");
          } catch (logoutErr) {
            console.error("Logout failed:", logoutErr);
          }
          router.push("/login");
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
