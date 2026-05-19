import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseTaskRow, serializeTask, SHEET_NAMES } from '@/lib/sheets';
import { taskSchema } from '@/lib/schemas';
import { DailyTask } from '@/lib/types';
import crypto from 'crypto';

export async function GET() {
  try {
    const rows = await getRows(SHEET_NAMES.DAILY_TASKS);
    const tasks: DailyTask[] = rows.map(parseTaskRow);
    return NextResponse.json(tasks);
  } catch (error: unknown) {
    console.error('GET /api/tasks error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const task: DailyTask = {
      id: crypto.randomUUID(),
      ...parsed.data,
    };

    await appendRow(SHEET_NAMES.DAILY_TASKS, serializeTask(task));
    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/tasks error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
