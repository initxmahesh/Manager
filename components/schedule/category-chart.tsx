'use client';

import { ScheduleBlock, CATEGORY_META, ScheduleCategory } from '@/lib/schedule-data';

interface CategoryChartProps {
  blocks: ScheduleBlock[];
}

export function CategoryChart({ blocks }: CategoryChartProps) {
  // Calculate hours per category
  const categoryHours: Record<ScheduleCategory, number> = {
    loksewa: 0,
    software: 0,
    mental: 0,
    life: 0,
  };

  blocks.forEach(block => {
    categoryHours[block.category] += block.endHour - block.startHour;
  });

  const totalHours = Object.values(categoryHours).reduce((a, b) => a + b, 0);

  const categories = (Object.entries(categoryHours) as [ScheduleCategory, number][])
    .filter(([, hours]) => hours > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        Time Distribution
      </p>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted/50">
        {categories.map(([cat, hours], i) => (
          <div
            key={cat}
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${(hours / totalHours) * 100}%`,
              backgroundColor: CATEGORY_META[cat].color,
              opacity: 0.85,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {categories.map(([cat, hours]) => (
          <div key={cat} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_META[cat].color }}
            />
            <span className="text-[11px] text-muted-foreground truncate">
              {CATEGORY_META[cat].label}
            </span>
            <span className="text-[11px] font-medium tabular-nums ml-auto">
              {hours.toFixed(1)}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
