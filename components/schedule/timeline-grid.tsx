'use client';

import { TIMELINE_START, TIMELINE_END, HOUR_HEIGHT, formatHour } from '@/lib/schedule-data';

export function TimelineGrid() {
  const hours = [];
  for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
    hours.push(h);
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {hours.map((hour, i) => {
        const top = (hour - TIMELINE_START) * HOUR_HEIGHT;
        const isMainHour = hour % 3 === 0;
        return (
          <div
            key={hour}
            className="absolute left-0 right-0 animate-in fade-in"
            style={{ top: `${top}px`, animationDelay: `${i * 20}ms` }}
          >
            {/* Hour label */}
            <span
              className={`absolute -left-14 sm:-left-[4.5rem] -translate-y-1/2 text-right w-12 font-mono tabular-nums select-none
                ${isMainHour ? 'text-[11px] text-muted-foreground/70 font-medium' : 'text-[10px] text-muted-foreground/40'}`}
            >
              {formatHour(hour)}
            </span>
            {/* Grid line */}
            <div
              className={`absolute left-0 right-0 border-t ${
                isMainHour
                  ? 'border-border/40 dark:border-border/25'
                  : 'border-border/20 dark:border-border/10 border-dashed'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
