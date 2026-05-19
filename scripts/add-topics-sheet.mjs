import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const auth = new google.auth.JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const sheetId = env.GOOGLE_SHEET_ID;

try {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

  // Create loksewa_topics sheet
  if (!existingSheets.includes('loksewa_topics')) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: 'loksewa_topics' } } }] },
    });
    console.log('Created: loksewa_topics');
  }

  // Set headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'loksewa_topics!A1:G1',
    valueInputOption: 'RAW',
    requestBody: { values: [['id', 'subject_id', 'topic_name', 'status', 'times_wrong', 'last_studied', 'notes']] },
  });
  console.log('Headers set for loksewa_topics');

  // Also update loksewa_tracker headers to match new session format
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'loksewa_tracker!A1:L1',
    valueInputOption: 'RAW',
    requestBody: { values: [['id', 'date', 'subject_id', 'topic', 'session_type', 'time_spent_min', 'confidence', 'questions_attempted', 'questions_correct', 'score_percent', 'weak_topics', 'notes']] },
  });
  console.log('Headers updated for loksewa_tracker');

  console.log('Done!');
} catch (err) {
  console.error('Error:', err.message);
}
