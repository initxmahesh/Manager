'use client';

import { StudySession } from '@/lib/loksewa-types';
import { cn } from '@/lib/utils';

interface StudyHeatmapProps {
  sessions: StudySession[];
}

export function StudyHeatmap({ sessions }: StudyHeatmapProps) {
  // Build 90-day grid
  const today = new Date();
  const days: { date: string; minutes: number }[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayMinutes = sessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.time_spent_min, 0);
    days.push({ date: dateStr, minutes: dayMinutes });
  }

  const maxMinutes = Math.max(...days.map(d => d.minutes), 1);

  function getColor(minutes: number): string {
    if (minutes === 0) return 'bg-gray-100 dark:bg-gray-800/50';
    const intensity = minutes / maxMinutes;
    if (intensity < 0.25) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (intensity < 0.5) return 'bg-emerald-300 dark:bg-emerald-700/50';
    if (intensity < 0.75) return 'bg-emerald-400 dark:bg-emerald-600/60';
    return 'bg-emerald-500 dark:bg-emerald-500';
  }

  // Stats
  const totalDaysStudied = days.filter(d => d.minutes > 0).length;
  const totalMinutes = days.reduce((s, d) => s + d.minutes, 0);
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].minutes > 0) currentStreak++;
    else if (i === days.length - 1) continue; // today might not have data yet
    else break;
  }

  return (
    <div>
      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span>🔥 Streak: <strong className="text-foreground">{currentStreak}d</strong></span>
        <span>📅 Studied: <strong className="text-foreground">{totalDaysStudied}/90</strong> days</span>
        <span>⏱️ Total: <strong className="text-foreground">{Math.round(totalMinutes / 60)}h</strong></span>
      </div>

      {/* Heatmap grid — 13 weeks × 7 days */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[repeat(13,1fr)] gap-[2px] sm:gap-1 min-w-[280px]">
          {Array.from({ length: 13 }).map((_, weekIdx) => (
            <div key={weekIdx} className="grid grid-rows-7 gap-[2px] sm:gap-1">
              {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    'aspect-square rounded-[2px] sm:rounded-sm transition-all hover:scale-150 hover:z-10 cursor-default',
                    getColor(day.minutes)
                  )}
                  title={`${day.date}: ${day.minutes > 0 ? `${day.minutes} min studied` : 'No study'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="h-2.5 w-2.5 rounded-sm bg-gray-100 dark:bg-gray-800/50" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-700/50" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-600/60" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
        <span>More</span>
      </div>
    </div>
  );
}
