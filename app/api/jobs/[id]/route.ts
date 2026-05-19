import { NextRequest, NextResponse } from 'next/server';
import { findRowById, updateRow, deleteRow, parseJobRow, serializeJob, SHEET_NAMES } from '@/lib/sheets';
import { jobUpdateSchema } from '@/lib/schemas';
import { JobApplication } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.JOB_APPLICATIONS, id);
    if (!result) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }
    return NextResponse.json(parseJobRow(result.values));
  } catch (error: unknown) {
    console.error('GET /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch job application' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = jobUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await findRowById(SHEET_NAMES.JOB_APPLICATIONS, id);
    if (!result) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    const existing = parseJobRow(result.values);
    const updated: JobApplication = { ...existing, ...parsed.data };
    await updateRow(SHEET_NAMES.JOB_APPLICATIONS, result.rowIndex, serializeJob(updated));
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PATCH /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update job application' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.JOB_APPLICATIONS, id);
    if (!result) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }
    await deleteRow(SHEET_NAMES.JOB_APPLICATIONS, result.rowIndex);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete job application' }, { status: 500 });
  }
}
