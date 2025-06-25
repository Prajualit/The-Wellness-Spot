import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { google } from "googleapis";

const router = express.Router();

let credentials;
try {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not set");
  }

  const credentialsString = Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,
    "base64"
  ).toString("utf8");
  credentials = JSON.parse(credentialsString);

  console.log("Credentials parsed from base64 successfully");
} catch (error) {
  console.error("Failed to parse credentials:", error.message);
  process.exit(1);
}

// Create GoogleAuth instance using credentials directly
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "14-5XEztwwHnWdh8t7I1sE0PcCeJS67oSS6oDI1v_4x4"; // Replace with your sheet ID

router.post("/submit-query", async (req, res) => {
  const { name, email, query } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:D", // Changed A:C → A:D to include timestamp
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, email, query, new Date().toISOString()]],
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Google Sheets error:", err);
    res.status(500).json({ success: false, error: "Failed to save query" });
  }
});

export default router;
