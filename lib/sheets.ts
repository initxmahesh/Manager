import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { DailyTask, LoksewaEntry, JobApplication, WeeklyGoal } from './types';
import { SHEET_NAMES } from './constants';

function getAuthClient(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email) throw new Error('Missing env var: GOOGLE_SERVICE_ACCOUNT_EMAIL');
  if (!key) throw new Error('Missing env var: GOOGLE_PRIVATE_KEY');
  if (!sheetId) throw new Error('Missing env var: GOOGLE_SHEET_ID');

  return new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheetsClient() {
  const auth = getAuthClient();
  return google.sheets({ version: 'v4', auth });
}

function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error('Missing env var: GOOGLE_SHEET_ID');
  return id;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; code?: number; message?: string };
      lastError = error instanceof Error ? error : new Error(String(error));
      const status = err?.response?.status || err?.code;
      if (attempt < maxRetries && (status === 429 || (typeof status === 'number' && status >= 500))) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      throw lastError;
    }
  }
  throw lastError;
}

export async function getRows(sheetName: string): Promise<string[][]> {
  return withRetry(async () => {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: getSheetId(),
      range: `${sheetName}!A2:Z`,
    });
    return (response.data.values as string[][]) || [];
  });
}

export async function appendRow(sheetName: string, values: string[]): Promise<void> {
  return withRetry(async () => {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: getSheetId(),
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: { values: [values] },
    });
  });
}

export async function findRowById(sheetName: string, id: string): Promise<{ rowIndex: number; values: string[] } | null> {
  const rows = await getRows(sheetName);
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === id) {
      return { rowIndex: i + 2, values: rows[i] }; // +2 because row 1 is header, data starts at row 2
    }
  }
  return null;
}

export async function updateRow(sheetName: string, rowIndex: number, values: string[]): Promise<void> {
  return withRetry(async () => {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId: getSheetId(),
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [values] },
    });
  });
}

export async function deleteRow(sheetName: string, rowIndex: number): Promise<void> {
  return withRetry(async () => {
    const sheets = getSheetsClient();
    // Get the sheet's gid (sheetId) first
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: getSheetId(),
    });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName);
    if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: getSheetId(),
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // 0-indexed
              endIndex: rowIndex,
            },
          },
        }],
      },
    });
  });
}

// Parse helpers
export function parseTaskRow(row: string[]): DailyTask {
  return {
    id: row[0] || '',
    date: row[1] || '',
    time_slot: row[2] || '',
    task_name: row[3] || '',
    category: (row[4] as DailyTask['category']) || 'life',
    day_type: (row[5] as DailyTask['day_type']) || 'weekday',
    completed: row[6]?.toUpperCase() === 'TRUE',
    notes: row[7] || '',
  };
}

export function serializeTask(task: DailyTask): string[] {
  return [
    task.id,
    task.date,
    task.time_slot,
    task.task_name,
    task.category,
    task.day_type,
    task.completed ? 'TRUE' : 'FALSE',
    task.notes,
  ];
}

export function parseLoksewaRow(row: string[]): LoksewaEntry {
  return {
    id: row[0] || '',
    date: row[1] || '',
    subject: (row[2] as LoksewaEntry['subject']) || 'GK',
    topic: row[3] || '',
    questions_attempted: parseInt(row[4]) || 0,
    questions_correct: parseInt(row[5]) || 0,
    score_percent: parseFloat(row[6]) || 0,
    mock_exam: row[7]?.toUpperCase() === 'TRUE',
    weak_areas: row[8] || '',
    notes: row[9] || '',
  };
}

export function serializeLoksewa(entry: LoksewaEntry): string[] {
  return [
    entry.id,
    entry.date,
    entry.subject,
    entry.topic,
    String(entry.questions_attempted),
    String(entry.questions_correct),
    String(entry.score_percent),
    entry.mock_exam ? 'TRUE' : 'FALSE',
    entry.weak_areas,
    entry.notes,
  ];
}

export function parseJobRow(row: string[]): JobApplication {
  return {
    id: row[0] || '',
    date_applied: row[1] || '',
    company: row[2] || '',
    role: row[3] || '',
    location: (row[4] as JobApplication['location']) || 'Nepal',
    platform: (row[5] as JobApplication['platform']) || 'Other',
    status: (row[6] as JobApplication['status']) || 'Applied',
    salary_offered: row[7] || '',
    follow_up_date: row[8] || '',
    notes: row[9] || '',
    link: row[10] || '',
  };
}

export function serializeJob(job: JobApplication): string[] {
  return [
    job.id,
    job.date_applied,
    job.company,
    job.role,
    job.location,
    job.platform,
    job.status,
    job.salary_offered,
    job.follow_up_date,
    job.notes,
    job.link,
  ];
}

export function parseWeeklyRow(row: string[]): WeeklyGoal {
  return {
    id: row[0] || '',
    week_start_date: row[1] || '',
    goal_loksewa: row[2] || '',
    goal_software: row[3] || '',
    goal_jobs_target: parseInt(row[4]) || 0,
    jobs_applied: parseInt(row[5]) || 0,
    loksewa_mock_score: parseFloat(row[6]) || 0,
    notes: row[7] || '',
    completed: row[8]?.toUpperCase() === 'TRUE',
  };
}

export function serializeWeekly(goal: WeeklyGoal): string[] {
  return [
    goal.id,
    goal.week_start_date,
    goal.goal_loksewa,
    goal.goal_software,
    String(goal.goal_jobs_target),
    String(goal.jobs_applied),
    String(goal.loksewa_mock_score),
    goal.notes,
    goal.completed ? 'TRUE' : 'FALSE',
  ];
}

export { SHEET_NAMES };
