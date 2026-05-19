import { NextRequest, NextResponse } from 'next/server';
import { findRowById, updateRow, deleteRow, parseTaskRow, serializeTask, SHEET_NAMES } from '@/lib/sheets';
import { taskUpdateSchema } from '@/lib/schemas';
import { DailyTask } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.DAILY_TASKS, id);
    if (!result) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(parseTaskRow(result.values));
  } catch (error: unknown) {
    console.error('GET /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await findRowById(SHEET_NAMES.DAILY_TASKS, id);
    if (!result) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const existing = parseTaskRow(result.values);
    const updated: DailyTask = { ...existing, ...parsed.data };
    await updateRow(SHEET_NAMES.DAILY_TASKS, result.rowIndex, serializeTask(updated));
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PATCH /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findRowById(SHEET_NAMES.DAILY_TASKS, id);
    if (!result) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    await deleteRow(SHEET_NAMES.DAILY_TASKS, result.rowIndex);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
