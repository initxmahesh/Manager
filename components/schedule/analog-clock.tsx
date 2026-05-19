'use client';

import { useState, useEffect, useCallback } from 'react';

interface AnalogClockProps {
  /** Override time (hour as decimal, e.g. 14.5 = 2:30 PM). null = real time */
  overrideHour: number | null;
  onTimeChange?: (hour: number) => void;
  adjustable?: boolean;
}

export function AnalogClock({ overrideHour, onTimeChange, adjustable = true }: AnalogClockProps) {
  const [time, setTime] = useState(new Date());
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (overrideHour !== null) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [overrideHour]);

  const hours = overrideHour !== null ? Math.floor(overrideHour) % 12 : time.getHours() % 12;
  const minutes = overrideHour !== null ? Math.round((overrideHour % 1) * 60) : time.getMinutes();
  const seconds = overrideHour !== null ? 0 : time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!adjustable) return;
    setDragging(true);
    handleDrag(e);
  }, [adjustable]);

  const handleDrag = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!adjustable) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    // Convert angle to hours (0 at top, clockwise)
    let hourAngle = (angle * 180 / Math.PI + 90 + 360) % 360;
    let newHour = (hourAngle / 30) % 12;
    // Determine AM/PM based on current context
    const currentFullHour = overrideHour !== null ? overrideHour : time.getHours() + time.getMinutes() / 60;
    if (currentFullHour >= 12) newHour += 12;
    if (newHour >= 24) newHour -= 24;
    onTimeChange?.(Math.round(newHour * 4) / 4); // Snap to 15-min intervals
  }, [adjustable, onTimeChange, overrideHour, time]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      const up = () => setDragging(false);
      window.addEventListener('mouseup', up);
      return () => window.removeEventListener('mouseup', up);
    }
  }, [dragging]);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 200 200"
        className={cn(
          'w-28 h-28 xl:w-32 xl:h-32 drop-shadow-lg',
          adjustable && 'cursor-pointer'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={dragging ? handleDrag : undefined}
        onMouseUp={handleMouseUp}
      >
        {/* Clock face */}
        <circle cx="100" cy="100" r="95" className="fill-card stroke-border" strokeWidth="2" />
        
        {/* Subtle inner ring */}
        <circle cx="100" cy="100" r="88" fill="none" className="stroke-border/30" strokeWidth="0.5" />

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + 78 * Math.cos(angle);
          const y1 = 100 + 78 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-foreground/60"
              strokeWidth={i % 3 === 0 ? '2.5' : '1'}
              strokeLinecap="round"
            />
          );
        })}

        {/* Minute ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + 83 * Math.cos(angle);
          const y1 = 100 + 83 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-muted-foreground/30"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour hand */}
        <line
          x1="100" y1="100"
          x2={100 + 50 * Math.cos((hourDeg - 90) * Math.PI / 180)}
          y2={100 + 50 * Math.sin((hourDeg - 90) * Math.PI / 180)}
          className="stroke-foreground"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1="100" y1="100"
          x2={100 + 68 * Math.cos((minuteDeg - 90) * Math.PI / 180)}
          y2={100 + 68 * Math.sin((minuteDeg - 90) * Math.PI / 180)}
          className="stroke-foreground/80"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Second hand (only in real-time mode) */}
        {overrideHour === null && (
          <line
            x1="100" y1="100"
            x2={100 + 72 * Math.cos((secondDeg - 90) * Math.PI / 180)}
            y2={100 + 72 * Math.sin((secondDeg - 90) * Math.PI / 180)}
            stroke="#ef4444"
            strokeWidth="1"
            strokeLinecap="round"
            className="transition-transform"
          />
        )}

        {/* Center dot */}
        <circle cx="100" cy="100" r="4" className="fill-foreground" />
        <circle cx="100" cy="100" r="2" className="fill-card" />
      </svg>

      {/* Digital time below */}
      <div className="mt-2 text-center">
        <p className="text-sm font-mono font-semibold tabular-nums text-foreground">
          {String(overrideHour !== null ? Math.floor(overrideHour) % 24 : time.getHours()).padStart(2, '0')}
          <span className="animate-pulse">:</span>
          {String(minutes).padStart(2, '0')}
          {overrideHour === null && <span className="text-muted-foreground text-xs ml-0.5">:{String(seconds).padStart(2, '0')}</span>}
        </p>
        {overrideHour !== null && (
          <p className="text-[10px] text-amber-500 font-medium mt-0.5">Adjusted</p>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
