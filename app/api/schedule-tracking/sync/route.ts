import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, findRowById, updateRow, parseScheduleCompletionRow, serializeScheduleCompletion, SHEET_NAMES } from '@/lib/sheets';
import { ScheduleCompletion } from '@/lib/types';
import crypto from 'crypto';

/**
 * POST /api/schedule-tracking/sync
 * 
 * Bulk sync schedule completions for a specific date.
 * Accepts an array of task completions and upserts them.
 * 
 * Body: {
 *   date: string (YYYY-MM-DD),
 *   day_type: string,
 *   completions: Array<{
 *     block_id: string,
 *     block_title: string,
 *     category: string,
 *     task_index: number,
 *     task_name: string,
 *     completed: boolean,
 *   }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, day_type, completions } = body;

    if (!date || !Array.isArray(completions)) {
      return NextResponse.json(
        { error: 'Missing required fields: date, completions[]' },
        { status: 400 }
      );
    }

    // Get existing entries for this date
    const rows = await getRows(SHEET_NAMES.SCHEDULE_TRACKING);
    const existing = rows.map(parseScheduleCompletionRow);
    const existingForDate = existing.filter(e => e.date === date);

    const results: ScheduleCompletion[] = [];

    for (const comp of completions) {
      // Find if this specific task already has an entry for this date
      const existingEntry = existingForDate.find(
        e => e.block_id === comp.block_id && e.task_index === comp.task_index
      );

      if (existingEntry) {
        // Update existing entry
        if (existingEntry.completed !== comp.completed) {
          const updated: ScheduleCompletion = {
            ...existingEntry,
            completed: comp.completed,
            completed_at: comp.completed ? new Date().toISOString() : '',
          };
          const rowResult = await findRowById(SHEET_NAMES.SCHEDULE_TRACKING, existingEntry.id);
          if (rowResult) {
            await updateRow(SHEET_NAMES.SCHEDULE_TRACKING, rowResult.rowIndex, serializeScheduleCompletion(updated));
          }
          results.push(updated);
        } else {
          results.push(existingEntry);
        }
      } else if (comp.completed) {
        // Only create new entries for completed tasks
        const entry: ScheduleCompletion = {
          id: crypto.randomUUID(),
          date,
          weekday: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
          block_id: comp.block_id,
          block_title: comp.block_title || '',
          category: comp.category || 'life',
          task_index: comp.task_index ?? 0,
          task_name: comp.task_name || '',
          completed: true,
          completed_at: new Date().toISOString(),
          day_type: day_type || '',
        };
        await appendRow(SHEET_NAMES.SCHEDULE_TRACKING, serializeScheduleCompletion(entry));
        results.push(entry);
      }
    }

    return NextResponse.json({ date, synced: results.length, entries: results });
  } catch (error: unknown) {
    console.error('POST /api/schedule-tracking/sync error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to sync schedule tracking' }, { status: 500 });
  }
}
