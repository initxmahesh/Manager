import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseLoksewaRow, serializeLoksewa, SHEET_NAMES } from '@/lib/sheets';
import { loksewaSchema } from '@/lib/schemas';
import { LoksewaEntry } from '@/lib/types';
import crypto from 'crypto';

export async function GET() {
  try {
    const rows = await getRows(SHEET_NAMES.LOKSEWA_TRACKER);
    const entries: LoksewaEntry[] = rows.map(parseLoksewaRow);
    return NextResponse.json(entries);
  } catch (error: unknown) {
    console.error('GET /api/loksewa error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch loksewa entries' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loksewaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const scorePercent = Math.round((parsed.data.questions_correct / parsed.data.questions_attempted) * 100);

    const entry: LoksewaEntry = {
      id: crypto.randomUUID(),
      ...parsed.data,
      score_percent: scorePercent,
    };

    await appendRow(SHEET_NAMES.LOKSEWA_TRACKER, serializeLoksewa(entry));
    return NextResponse.json(entry, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/loksewa error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to create loksewa entry' }, { status: 500 });
  }
}
