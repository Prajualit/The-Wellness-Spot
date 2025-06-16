import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Log the GOOGLE_SERVICE_ACCOUNT_KEY and check if the file exists
// console.log('GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
// console.log('File exists:', fs.existsSync(process.env.GOOGLE_SERVICE_ACCOUNT_KEY));

// Load your service account key
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = '14-5XEztwwHnWdh8t7I1sE0PcCeJS67oSS6oDI1v_4x4'; // Replace with your sheet ID

router.post('/submit-query', async (req, res) => {
  const { name, email, query } = req.body;
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:C', // Adjust if your sheet/range is different
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, email, query, new Date().toISOString()]],
      },
    });
    // console.log('Append result:', result.data);
    res.json({ success: true });
  } catch (err) {
    console.error('Google Sheets error:', err);
    res.status(500).json({ success: false, error: 'Failed to save query' });
  }
});

export default router;