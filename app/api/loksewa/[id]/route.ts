import { NextRequest, NextResponse } from 'next/server';
import { findRowById, updateRow, deleteRow, parseLoksewaRow, serializeLoksewa, SHEET_NAMES } from '@/lib/sheets';
import { loksewaUpdateSchema } from '@/lib/schemas';
import { LoksewaEntry } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.LOKSEWA_TRACKER, id);
    if (!result) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json(parseLoksewaRow(result.values));
  } catch (error: unknown) {
    console.error('GET /api/loksewa/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = loksewaUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await findRowById(SHEET_NAMES.LOKSEWA_TRACKER, id);
    if (!result) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const existing = parseLoksewaRow(result.values);
    const updated: LoksewaEntry = { ...existing, ...parsed.data };

    // Recalculate score if questions changed
    if (parsed.data.questions_attempted !== undefined || parsed.data.questions_correct !== undefined) {
      updated.score_percent = Math.round((updated.questions_correct / updated.questions_attempted) * 100);
    }

    await updateRow(SHEET_NAMES.LOKSEWA_TRACKER, result.rowIndex, serializeLoksewa(updated));
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PATCH /api/loksewa/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.LOKSEWA_TRACKER, id);
    if (!result) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    await deleteRow(SHEET_NAMES.LOKSEWA_TRACKER, result.rowIndex);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/loksewa/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
