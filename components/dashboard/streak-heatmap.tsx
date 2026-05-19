'use client';

import { useState, useEffect } from 'react';
import { STREAK_MILESTONES } from '@/lib/motivation-data';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface DaySummary {
  date: string;
  weekday: string;
  completion_rate: number;
}

interface HistoryResponse {
  summaries: DaySummary[];
  streak: number;
  total_days_tracked: number;
  avg_completion_rate: number;
}

export function StreakHeatmap() {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/schedule-tracking/history?days=90');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/10 p-5 animate-pulse">
        <div className="h-6 w-40 bg-muted rounded mb-4" />
        <div className="h-24 bg-muted rounded" />
      </div>
    );
  }

  const streak = history?.streak || 0;
  const summaries = history?.summaries || [];
  const avgRate = history?.avg_completion_rate || 0;

  // Build 90-day grid (13 weeks)
  const today = new Date();
  const days: { date: string; rate: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const summary = summaries.find(s => s.date === dateStr);
    days.push({ date: dateStr, rate: summary?.completion_rate || 0 });
  }

  // Current milestone
  const currentMilestone = [...STREAK_MILESTONES].reverse().find(m => streak >= m.days);
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak);

  function getColor(rate: number): string {
    if (rate === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (rate < 40) return 'bg-red-200 dark:bg-red-900/40';
    if (rate < 70) return 'bg-amber-200 dark:bg-amber-800/40';
    if (rate < 90) return 'bg-emerald-300 dark:bg-emerald-700/50';
    return 'bg-emerald-500 dark:bg-emerald-500';
  }

  return (
    <div className="rounded-2xl border-2 border-orange-200 dark:border-orange-900/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/10 dark:to-amber-950/10 p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h3 className="text-base font-bold">Daily Streak</h3>
            <p className="text-xs text-muted-foreground">Complete 70%+ tasks to keep the chain</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-3xl font-extrabold tabular-nums text-orange-600 dark:text-orange-400">{streak}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">days</p>
        </div>
      </div>

      {/* Milestone badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STREAK_MILESTONES.map((m) => (
          <div
            key={m.days}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all',
              streak >= m.days
                ? 'bg-white dark:bg-white/10 border-amber-300 dark:border-amber-700 text-foreground shadow-sm'
                : 'border-border/30 text-muted-foreground/40'
            )}
          >
            <span>{m.badge}</span>
            <span>{m.days}d</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-[repeat(13,1fr)] gap-[3px] sm:gap-1">
        {/* Week labels */}
        {Array.from({ length: 13 }).map((_, weekIdx) => (
          <div key={weekIdx} className="grid grid-rows-7 gap-[3px] sm:gap-1">
            {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => (
              <div
                key={day.date}
                className={cn(
                  'aspect-square rounded-[3px] sm:rounded transition-all duration-200 hover:scale-125 hover:z-10 cursor-default',
                  getColor(day.rate)
                )}
                title={`${day.date}: ${day.rate}% completed`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="h-2.5 w-2.5 rounded-sm bg-red-200 dark:bg-red-900/40" />
          <div className="h-2.5 w-2.5 rounded-sm bg-amber-200 dark:bg-amber-800/40" />
          <div className="h-2.5 w-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-700/50" />
          <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          <span>More</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Avg: {avgRate}% • {history?.total_days_tracked || 0} days tracked
        </span>
      </div>

      {/* Next milestone */}
      {nextMilestone && (
        <div className="mt-3 p-2.5 rounded-lg bg-white/60 dark:bg-white/5 border border-border/30">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{nextMilestone.badge} Next: {nextMilestone.label}</span>
            {' '}— {nextMilestone.days - streak} days to go!
          </p>
        </div>
      )}

      {/* Current milestone celebration */}
      {currentMilestone && (
        <div className="mt-2 text-center">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {currentMilestone.badge} {currentMilestone.message}
          </p>
        </div>
      )}
    </div>
  );
}
