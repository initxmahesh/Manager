import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseScheduleCompletionRow, serializeScheduleCompletion, SHEET_NAMES } from '@/lib/sheets';
import { ScheduleCompletion } from '@/lib/types';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // optional filter by date

    const rows = await getRows(SHEET_NAMES.SCHEDULE_TRACKING);
    let entries: ScheduleCompletion[] = rows.map(parseScheduleCompletionRow);

    if (date) {
      entries = entries.filter(e => e.date === date);
    }

    return NextResponse.json(entries);
  } catch (error: unknown) {
    console.error('GET /api/schedule-tracking error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch schedule tracking' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.date || !body.block_id || !body.task_name) {
      return NextResponse.json(
        { error: 'Missing required fields: date, block_id, task_name' },
        { status: 400 }
      );
    }

    const entry: ScheduleCompletion = {
      id: crypto.randomUUID(),
      date: body.date,
      weekday: body.weekday || new Date(body.date).toLocaleDateString('en-US', { weekday: 'long' }),
      block_id: body.block_id,
      block_title: body.block_title || '',
      category: body.category || 'life',
      task_index: body.task_index ?? 0,
      task_name: body.task_name,
      completed: body.completed ?? true,
      completed_at: body.completed_at || new Date().toISOString(),
      day_type: body.day_type || '',
    };

    await appendRow(SHEET_NAMES.SCHEDULE_TRACKING, serializeScheduleCompletion(entry));
    return NextResponse.json(entry, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/schedule-tracking error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to save schedule tracking' }, { status: 500 });
  }
}
