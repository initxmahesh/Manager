import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseStudySessionRow, serializeStudySession, SHEET_NAMES } from '@/lib/sheets';
import { StudySession } from '@/lib/loksewa-types';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const days = parseInt(searchParams.get('days') || '90');

    const rows = await getRows(SHEET_NAMES.LOKSEWA_TRACKER);
    let sessions: StudySession[] = rows.map(parseStudySessionRow);

    // Filter by date range
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    sessions = sessions.filter(s => s.date >= cutoffStr);

    if (subject) {
      sessions = sessions.filter(s => s.subject_id === subject);
    }

    return NextResponse.json(sessions);
  } catch (error: unknown) {
    console.error('GET /api/loksewa/sessions error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.date || !body.subject_id) {
      return NextResponse.json({ error: 'date and subject_id are required' }, { status: 400 });
    }

    const scorePercent = body.questions_attempted > 0
      ? Math.round((body.questions_correct / body.questions_attempted) * 100)
      : 0;

    const session: StudySession = {
      id: crypto.randomUUID(),
      date: body.date,
      subject_id: body.subject_id,
      topic: body.topic || '',
      session_type: body.session_type || 'deep_study',
      time_spent_min: body.time_spent_min || 0,
      confidence: body.confidence || 3,
      questions_attempted: body.questions_attempted || 0,
      questions_correct: body.questions_correct || 0,
      score_percent: scorePercent,
      weak_topics: body.weak_topics || '',
      notes: body.notes || '',
    };

    await appendRow(SHEET_NAMES.LOKSEWA_TRACKER, serializeStudySession(session));
    return NextResponse.json(session, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/loksewa/sessions error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
