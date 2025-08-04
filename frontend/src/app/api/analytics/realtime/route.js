// src/app/api/analytics/realtime/route.js
import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const auth = await getGoogleAuth();
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!propertyId) {
      throw new Error("GA4_PROPERTY_ID environment variable is not set");
    }

    // Initialize Google Analytics Data API
    const analyticsdata = google.analyticsdata("v1beta");

    // Fetch real-time users
    const realtimeResponse = await analyticsdata.properties.runRealtimeReport({
      auth,
      property: `properties/${propertyId}`,
      requestBody: {
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "country" }],
      },
    });

    const realtimeRows = realtimeResponse.data.rows || [];
    const realTimeUsers = realtimeRows.reduce((sum, row) => {
      return sum + parseInt(row.metricValues[0].value || 0);
    }, 0);

    // Generate recent activity (replace with real database queries)
    const recentActivity = generateRecentActivity();

    return NextResponse.json({
      realTimeUsers,
      recentActivity,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch real-time data", details: error.message },
      { status: 500 }
    );
  }
}

function generateRecentActivity() {
  const now = new Date();
  const activities = [];

  // Generate random recent activities
  const activityTypes = [
    {
      type: "login",
      descriptions: ["User logged in", "New user registered", "User returned"],
    },
    {
      type: "workout",
      descriptions: [
        "Workout started: Cardio",
        "Workout completed: Strength",
        "Exercise logged",
      ],
    },
    {
      type: "nutrition",
      descriptions: [
        "Meal logged: Lunch",
        "Snack added",
        "Water intake recorded",
      ],
    },
    {
      type: "goal",
      descriptions: ["Goal updated", "Milestone reached", "New target set"],
    },
  ];

  for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
    const activityType =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const description =
      activityType.descriptions[
        Math.floor(Math.random() * activityType.descriptions.length)
      ];
    const minutesAgo = Math.floor(Math.random() * 30) + 1;

    activities.push({
      type: activityType.type,
      description,
      timestamp: `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`,
    });
  }

  return activities;
}
