'use client';

import { useState, useEffect } from 'react';
import { TIMELINE_START, TIMELINE_END, HOUR_HEIGHT } from '@/lib/schedule-data';

interface CurrentTimeIndicatorProps {
  overrideHour?: number | null;
}

export function CurrentTimeIndicator({ overrideHour }: CurrentTimeIndicatorProps) {
  const [currentHour, setCurrentHour] = useState(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  });

  useEffect(() => {
    if (overrideHour !== null && overrideHour !== undefined) return;
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours() + now.getMinutes() / 60);
    }, 15000);
    return () => clearInterval(interval);
  }, [overrideHour]);

  const displayHour = overrideHour ?? currentHour;

  // Don't show if outside timeline range
  if (displayHour < TIMELINE_START || displayHour > TIMELINE_END) return null;

  const top = (displayHour - TIMELINE_START) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none transition-all duration-1000 ease-linear"
      style={{ top: `${top}px` }}
    >
      <div className="relative flex items-center">
        {/* Glowing dot */}
        <div className="absolute -left-1 -translate-y-1/2 flex items-center gap-1.5 z-10">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/40" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-red-500 animate-ping opacity-40" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 hidden sm:inline bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {overrideHour !== null ? 'SET' : 'NOW'}
          </span>
        </div>

        {/* Dashed line with gradient fade */}
        <div className="w-full ml-10 sm:ml-14 relative">
          <div className="absolute inset-0 border-t-[1.5px] border-dashed border-red-500/50" />
          {/* Gradient fade on right */}
          <div className="absolute right-0 top-0 w-16 h-[2px] -translate-y-[1px] bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </div>
  );
}
