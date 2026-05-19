import { NextRequest, NextResponse } from 'next/server';
import { findRowById, updateRow, deleteRow, parseLoksewaTopicRow, serializeLoksewaTopic, SHEET_NAMES } from '@/lib/sheets';
import { LoksewaTopic } from '@/lib/loksewa-types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await findRowById(SHEET_NAMES.LOKSEWA_TOPICS, id);
    if (!result) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const existing = parseLoksewaTopicRow(result.values);
    const updated: LoksewaTopic = { ...existing, ...body };
    await updateRow(SHEET_NAMES.LOKSEWA_TOPICS, result.rowIndex, serializeLoksewaTopic(updated));
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PATCH /api/loksewa/topics/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.LOKSEWA_TOPICS, id);
    if (!result) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    await deleteRow(SHEET_NAMES.LOKSEWA_TOPICS, result.rowIndex);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/loksewa/topics/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}
