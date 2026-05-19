import { NextRequest, NextResponse } from 'next/server';
import { getRows, parseScheduleCompletionRow, SHEET_NAMES } from '@/lib/sheets';
import { ScheduleCompletion } from '@/lib/types';

/**
 * GET /api/schedule-tracking/history
 * 
 * Returns daily summaries of schedule completions.
 * Query params:
 *   - days: number of past days to include (default 30)
 *   - category: filter by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const categoryFilter = searchParams.get('category');

    const rows = await getRows(SHEET_NAMES.SCHEDULE_TRACKING);
    let entries: ScheduleCompletion[] = rows.map(parseScheduleCompletionRow);

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    entries = entries.filter(e => e.date >= cutoffStr);

    // Filter by category if specified
    if (categoryFilter) {
      entries = entries.filter(e => e.category === categoryFilter);
    }

    // Group by date and compute daily summaries
    const dailySummaries: Record<string, {
      date: string;
      weekday: string;
      total_tasks: number;
      completed_tasks: number;
      completion_rate: number;
      categories: Record<string, { completed: number; total: number }>;
      blocks_touched: string[];
    }> = {};

    for (const entry of entries) {
      if (!dailySummaries[entry.date]) {
        dailySummaries[entry.date] = {
          date: entry.date,
          weekday: entry.weekday || new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
          total_tasks: 0,
          completed_tasks: 0,
          completion_rate: 0,
          categories: {},
          blocks_touched: [],
        };
      }

      const day = dailySummaries[entry.date];
      day.total_tasks++;
      if (entry.completed) day.completed_tasks++;

      // Category breakdown
      if (!day.categories[entry.category]) {
        day.categories[entry.category] = { completed: 0, total: 0 };
      }
      day.categories[entry.category].total++;
      if (entry.completed) day.categories[entry.category].completed++;

      // Track unique blocks
      if (!day.blocks_touched.includes(entry.block_id)) {
        day.blocks_touched.push(entry.block_id);
      }
    }

    // Calculate completion rates
    for (const day of Object.values(dailySummaries)) {
      day.completion_rate = day.total_tasks > 0
        ? Math.round((day.completed_tasks / day.total_tasks) * 100)
        : 0;
    }

    // Sort by date descending
    const summaries = Object.values(dailySummaries).sort((a, b) => b.date.localeCompare(a.date));

    // Calculate streak
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = summaries.map(s => s.date).sort().reverse();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(expectedStr)) {
        const daySummary = dailySummaries[expectedStr];
        if (daySummary && daySummary.completion_rate >= 50) {
          streak++;
        } else {
          break;
        }
      } else {
        // Allow skipping today if it hasn't started yet
        if (i === 0 && expectedStr === today) continue;
        break;
      }
    }

    return NextResponse.json({
      summaries,
      streak,
      total_days_tracked: summaries.length,
      avg_completion_rate: summaries.length > 0
        ? Math.round(summaries.reduce((s, d) => s + d.completion_rate, 0) / summaries.length)
        : 0,
    });
  } catch (error: unknown) {
    console.error('GET /api/schedule-tracking/history error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Missing env var')) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 502 });
  }
}
