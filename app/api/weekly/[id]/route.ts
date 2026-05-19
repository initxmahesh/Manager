import { NextRequest, NextResponse } from 'next/server';
import { findRowById, updateRow, deleteRow, parseWeeklyRow, serializeWeekly, SHEET_NAMES } from '@/lib/sheets';
import { weeklyUpdateSchema } from '@/lib/schemas';
import { WeeklyGoal } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.WEEKLY_GOALS, id);
    if (!result) {
      return NextResponse.json({ error: 'Weekly goal not found' }, { status: 404 });
    }
    return NextResponse.json(parseWeeklyRow(result.values));
  } catch (error: unknown) {
    console.error('GET /api/weekly/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch weekly goal' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = weeklyUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await findRowById(SHEET_NAMES.WEEKLY_GOALS, id);
    if (!result) {
      return NextResponse.json({ error: 'Weekly goal not found' }, { status: 404 });
    }

    const existing = parseWeeklyRow(result.values);
    const updated: WeeklyGoal = { ...existing, ...parsed.data };
    await updateRow(SHEET_NAMES.WEEKLY_GOALS, result.rowIndex, serializeWeekly(updated));
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PATCH /api/weekly/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update weekly goal' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.WEEKLY_GOALS, id);
    if (!result) {
      return NextResponse.json({ error: 'Weekly goal not found' }, { status: 404 });
    }
    await deleteRow(SHEET_NAMES.WEEKLY_GOALS, result.rowIndex);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/weekly/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete weekly goal' }, { status: 500 });
  }
}
