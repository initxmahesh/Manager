import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseWeeklyRow, serializeWeekly, SHEET_NAMES } from '@/lib/sheets';
import { weeklySchema } from '@/lib/schemas';
import { WeeklyGoal } from '@/lib/types';
import crypto from 'crypto';

export async function GET() {
  try {
    const rows = await getRows(SHEET_NAMES.WEEKLY_GOALS);
    const goals: WeeklyGoal[] = rows.map(parseWeeklyRow);
    return NextResponse.json(goals);
  } catch (error: unknown) {
    console.error('GET /api/weekly error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch weekly goals' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = weeklySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const goal: WeeklyGoal = {
      id: crypto.randomUUID(),
      ...parsed.data,
    };

    await appendRow(SHEET_NAMES.WEEKLY_GOALS, serializeWeekly(goal));
    return NextResponse.json(goal, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/weekly error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to create weekly goal' }, { status: 500 });
  }
}
