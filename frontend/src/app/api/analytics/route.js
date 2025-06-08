// src/app/api/analytics/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";

export const maxDuration = 30; // 30 seconds max

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

async function fetchAnalyticsData({ startDate, endDate, metrics }) {
  const auth = await getGoogleAuth();
  const analyticsdata = google.analyticsdata("v1beta");

  const response = await analyticsdata.properties.runReport({
    auth,
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [
        {
          startDate: startDate || "7daysAgo",
          endDate: endDate || "today",
        },
      ],
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: [{ name: "pagePath" }],
      limit: 10, // Limit to top 10 pages
    },
  });

  return response.data;
}

async function fetchRealtimeUsers() {
  const auth = await getGoogleAuth();
  const analyticsdata = google.analyticsdata("v1beta");

  const response = await analyticsdata.properties.runRealtimeReport({
    auth,
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    requestBody: {
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "country" }],
    },
  });

  // Sum active users across countries
  const realtimeRows = response.data.rows || [];
  const realTimeUsers = realtimeRows.reduce((sum, row) => {
    return sum + parseInt(row.metricValues[0].value || 0);
  }, 0);

  return realTimeUsers;
}

export async function POST(request) {
  try {
    console.log("Analytics API called at:", new Date().toISOString());

    let requestData = {};
    try {
      requestData = await request.json();
    } catch {
      console.log("No JSON body or invalid JSON, using defaults");
      requestData = {
        startDate: null,
        endDate: null,
        metrics: ["activeUsers", "sessions", "newUsers"],
        realTime: true,
      };
    }

    const { startDate, endDate, metrics, realTime } = requestData;
    console.log("Request params:", { startDate, endDate, metrics, realTime });

    // Fetch historical analytics data
    const analyticsData = await fetchAnalyticsData({
      startDate,
      endDate,
      metrics,
    });

    // Fetch real-time active users if requested
    let realTimeUsers = 0;
    if (realTime) {
      realTimeUsers = await fetchRealtimeUsers();
    }

    // Format top pages data
    const topPages = (analyticsData.rows || []).map((row) => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues.find((m) => m.value)?.value || "0"),
    }));

    const responseData = {
      metrics,
      startDate: startDate || "7daysAgo",
      endDate: endDate || "today",
      realTimeUsers,
      topPages,
      lastUpdated: new Date().toISOString(),
    };

    console.log("Returning real analytics data");

    const response = NextResponse.json(responseData);
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Analytics API error:", error);

    const fallbackData = {
      error: true,
      message: "Failed to fetch analytics data",
      lastUpdated: new Date().toISOString(),
    };

    const response = NextResponse.json(fallbackData, { status: 500 });
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return response;
  }
}

export async function GET(request) {
  console.log("GET request to analytics API");

  // Provide default data if GET is called without body
  const mockRequest = {
    json: () =>
      Promise.resolve({
        startDate: null,
        endDate: null,
        metrics: ["activeUsers", "sessions", "newUsers"],
        realTime: true,
      }),
  };

  return POST(mockRequest);
}
