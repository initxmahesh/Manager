import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseLoksewaTopicRow, serializeLoksewaTopic, SHEET_NAMES } from '@/lib/sheets';
import { LoksewaTopic } from '@/lib/loksewa-types';
import crypto from 'crypto';

export async function GET() {
  try {
    const rows = await getRows(SHEET_NAMES.LOKSEWA_TOPICS);
    const topics: LoksewaTopic[] = rows.map(parseLoksewaTopicRow);
    return NextResponse.json(topics);
  } catch (error: unknown) {
    console.error('GET /api/loksewa/topics error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.subject_id || !body.topic_name) {
      return NextResponse.json({ error: 'subject_id and topic_name are required' }, { status: 400 });
    }

    const topic: LoksewaTopic = {
      id: crypto.randomUUID(),
      subject_id: body.subject_id,
      topic_name: body.topic_name,
      status: body.status || 'not_started',
      times_wrong: body.times_wrong || 0,
      last_studied: body.last_studied || '',
      notes: body.notes || '',
    };

    await appendRow(SHEET_NAMES.LOKSEWA_TOPICS, serializeLoksewaTopic(topic));
    return NextResponse.json(topic, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/loksewa/topics error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
