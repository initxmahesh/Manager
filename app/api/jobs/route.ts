import { NextRequest, NextResponse } from 'next/server';
import { getRows, appendRow, parseJobRow, serializeJob, SHEET_NAMES } from '@/lib/sheets';
import { jobSchema } from '@/lib/schemas';
import { JobApplication } from '@/lib/types';
import crypto from 'crypto';

export async function GET() {
  try {
    const rows = await getRows(SHEET_NAMES.JOB_APPLICATIONS);
    const jobs: JobApplication[] = rows.map(parseJobRow);
    return NextResponse.json(jobs);
  } catch (error: unknown) {
    console.error('GET /api/jobs error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const job: JobApplication = {
      id: crypto.randomUUID(),
      ...parsed.data,
    };

    await appendRow(SHEET_NAMES.JOB_APPLICATIONS, serializeJob(job));
    return NextResponse.json(job, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/jobs error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to create job application' }, { status: 500 });
  }
}
