import express from "express";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const SPREADSHEET_ID = "14-5XEztwwHnWdh8t7I1sE0PcCeJS67oSS6oDI1v_4x4"; // Replace with your sheet ID

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,      // Add to your .env
    pass: process.env.MAIL_PASSWORD,  // App password, not Gmail password
  },
});

router.post("/send-daily-sheet", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1", // Change if your tab name is different
    });

    const rows = result.data.values;
    if (!rows || rows.length === 0) {
      return res.status(200).json({ message: "No data found in sheet." });
    }

    // Filter rows for today
    const today = new Date().toISOString().slice(0, 10);
    const todayRows = rows.filter(row =>
      row.some(cell => cell.includes && cell.includes(today))
    );

    if (todayRows.length === 0) {
      return res.status(200).json({ message: "No data for today." });
    }

    // Format as HTML table
    const htmlTable =
      "<table border='1' cellpadding='5'>" +
      todayRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("") +
      "</table>";

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO, // Add to your .env
      subject: "Today's Google Sheet Data",
      html: `<h2>Today's Google Sheet Data</h2>${htmlTable}`,
    });

    res.status(200).json({ message: "Sheet data emailed successfully!" });
  } catch (err) {
    console.error("Error sending sheet email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;