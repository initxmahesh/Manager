'use client';

import { ScheduleBlock, CATEGORY_META, formatHour, getDurationText } from '@/lib/schedule-data';

interface ScheduleTableProps {
  blocks: ScheduleBlock[];
  currentHour: number;
}

export function ScheduleTable({ blocks, currentHour }: ScheduleTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden bg-card/50 backdrop-blur-sm">
      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_100px_80px] sm:grid-cols-[100px_1fr_140px_100px] gap-0 border-b bg-muted/30 px-4 py-2.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Time</span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Block</span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block">Category</span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Duration</span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border/50">
        {blocks.map((block, i) => {
          const meta = CATEGORY_META[block.category];
          const isActive = currentHour >= block.startHour && currentHour < block.endHour;
          const isPast = block.endHour <= currentHour;
          const progress = isActive
            ? ((currentHour - block.startHour) / (block.endHour - block.startHour)) * 100
            : isPast ? 100 : 0;

          return (
            <div
              key={block.id}
              className={`
                relative grid grid-cols-[80px_1fr_100px_80px] sm:grid-cols-[100px_1fr_140px_100px] gap-0 px-4 py-3
                transition-all duration-300 group
                ${isActive ? 'bg-gradient-to-r from-transparent' : ''}
                ${isPast ? 'opacity-50' : ''}
                hover:bg-accent/30
                animate-in fade-in slide-in-from-bottom-1
              `}
              style={{
                animationDelay: `${i * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Progress underlay for active block */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-1000"
                  style={{
                    background: `linear-gradient(90deg, ${meta.color}08 0%, ${meta.color}04 ${progress}%, transparent ${progress}%)`,
                  }}
                />
              )}

              {/* Time */}
              <div className="flex flex-col justify-center relative z-10">
                <span className="text-[11px] font-mono tabular-nums text-foreground/80">
                  {formatHour(block.startHour)}
                </span>
                <span className="text-[10px] font-mono tabular-nums text-muted-foreground/60">
                  {formatHour(block.endHour)}
                </span>
              </div>

              {/* Block info */}
              <div className="flex items-center gap-3 relative z-10 min-w-0">
                {/* Color indicator */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div
                    className={`h-8 w-1 rounded-full transition-all duration-300 ${isActive ? 'scale-y-110' : ''}`}
                    style={{ backgroundColor: meta.color }}
                  />
                  {isActive && (
                    <div
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: meta.color }}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${isPast ? 'line-through decoration-muted-foreground/30' : ''}`}>
                    {block.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {block.tasks.slice(0, 2).join(' · ')}
                    {block.tasks.length > 2 && ` +${block.tasks.length - 2}`}
                  </p>
                </div>
              </div>

              {/* Category badge */}
              <div className="hidden sm:flex items-center relative z-10">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${meta.color}12`,
                    color: meta.color,
                  }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-end relative z-10">
                <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                  {getDurationText(block.startHour, block.endHour)}
                </span>
              </div>

              {/* Active indicator line on left */}
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                  style={{ backgroundColor: meta.color }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
