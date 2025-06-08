// src/app/api/analytics/route.js
import { NextResponse } from "next/server";

// Set a timeout for the entire request
export const maxDuration = 30; // 30 seconds max

export async function POST(request) {
  try {
    console.log("Analytics API called");

    const { startDate, endDate, metrics, realTime } = await request.json();
    console.log("Request params:", { startDate, endDate, metrics, realTime });

    // For now, return mock data immediately to stop the loading
    // We'll add real Google Analytics later once we confirm the setup
    const mockData = {
      activeUsers: Math.floor(Math.random() * 150) + 50,
      pageViews: Math.floor(Math.random() * 2000) + 500,
      sessions: Math.floor(Math.random() * 300) + 100,
      realTimeUsers: Math.floor(Math.random() * 15) + 1,
      topPages: [
        { page: "/", views: Math.floor(Math.random() * 500) + 200 },
        { page: "/dashboard", views: Math.floor(Math.random() * 300) + 100 },
        { page: "/workout", views: Math.floor(Math.random() * 250) + 80 },
        { page: "/nutrition", views: Math.floor(Math.random() * 200) + 60 },
        { page: "/progress", views: Math.floor(Math.random() * 150) + 40 },
        { page: "/profile", views: Math.floor(Math.random() * 100) + 30 },
      ],
      recentActivity: [
        {
          type: "login",
          description: "User logged in from New York",
          timestamp: new Date(
            Date.now() - Math.random() * 300000
          ).toLocaleTimeString(),
        },
        {
          type: "workout",
          description: "Workout completed: Full Body Strength",
          timestamp: new Date(
            Date.now() - Math.random() * 600000
          ).toLocaleTimeString(),
        },
        {
          type: "nutrition",
          description: "Meal logged: Post-workout protein shake",
          timestamp: new Date(
            Date.now() - Math.random() * 900000
          ).toLocaleTimeString(),
        },
        {
          type: "goal",
          description: "New goal set: Run 5K in under 25 minutes",
          timestamp: new Date(
            Date.now() - Math.random() * 1200000
          ).toLocaleTimeString(),
        },
        {
          type: "login",
          description: "New user registered",
          timestamp: new Date(
            Date.now() - Math.random() * 1800000
          ).toLocaleTimeString(),
        },
      ],
    };

    console.log("Returning mock data");
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Analytics API error:", error);

    // Return fallback data even on error
    return NextResponse.json({
      activeUsers: 75,
      pageViews: 1250,
      sessions: 180,
      realTimeUsers: 8,
      topPages: [
        { page: "/", views: 350 },
        { page: "/dashboard", views: 180 },
        { page: "/workout", views: 120 },
        { page: "/nutrition", views: 95 },
      ],
      recentActivity: [
        {
          type: "login",
          description: "System status: Online",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    });
  }
}

/* 
TODO: Once the page loads properly, we can gradually add back Google Analytics:

import { google } from "googleapis";

async function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  return auth;
}

// Then replace mock data with real API calls
*/
