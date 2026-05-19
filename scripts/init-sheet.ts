/**
 * Initialize Google Sheet with correct header rows for all 4 tabs.
 * Run with: npx ts-node scripts/init-sheet.ts
 *
 * Requires .env.local to be configured with:
 * - GOOGLE_SHEET_ID
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const HEADERS = {
  daily_tasks: ['id', 'date', 'time_slot', 'task_name', 'category', 'day_type', 'completed', 'notes'],
  loksewa_tracker: ['id', 'date', 'subject', 'topic', 'questions_attempted', 'questions_correct', 'score_percent', 'mock_exam', 'weak_areas', 'notes'],
  job_applications: ['id', 'date_applied', 'company', 'role', 'location', 'platform', 'status', 'salary_offered', 'follow_up_date', 'notes', 'link'],
  weekly_goals: ['id', 'week_start_date', 'goal_loksewa', 'goal_software', 'goal_jobs_target', 'jobs_applied', 'loksewa_mock_score', 'notes', 'completed'],
  schedule_tracking: ['id', 'date', 'weekday', 'block_id', 'block_title', 'category', 'task_index', 'task_name', 'completed', 'completed_at', 'day_type'],
};

async function main() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    console.error('Missing environment variables. Please configure .env.local');
    process.exit(1);
  }

  const auth = new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get existing sheets
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

  console.log('Existing sheets:', existingSheets);

  for (const [sheetName, headers] of Object.entries(HEADERS)) {
    if (!existingSheets.includes(sheetName)) {
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: { title: sheetName },
            },
          }],
        },
      });
      console.log(`Created sheet: ${sheetName}`);
    }

    // Set headers in row 1
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
    console.log(`Set headers for: ${sheetName}`);
  }

  console.log('\nDone! All sheets initialized successfully.');
}

main().catch(console.error);
