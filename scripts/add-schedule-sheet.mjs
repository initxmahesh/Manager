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

const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const key = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const sheetId = env.GOOGLE_SHEET_ID;

const auth = new google.auth.JWT({
  email,
  key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

try {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

  if (!existingSheets.includes('schedule_tracking')) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: 'schedule_tracking' } } }],
      },
    });
    console.log('Created sheet: schedule_tracking');
  } else {
    console.log('Sheet schedule_tracking already exists');
  }

  const headers = ['id', 'date', 'weekday', 'block_id', 'block_title', 'category', 'task_index', 'task_name', 'completed', 'completed_at', 'day_type'];
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `schedule_tracking!A1:K1`,
    valueInputOption: 'RAW',
    requestBody: { values: [headers] },
  });
  console.log('Set headers for: schedule_tracking');
  console.log('Done!');
} catch (err) {
  console.error('Error:', err.message);
}
