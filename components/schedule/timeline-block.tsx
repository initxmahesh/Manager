'use client';

import { useState } from 'react';
import { ScheduleBlock, CATEGORY_META, formatTimeRange, getDurationText, HOUR_HEIGHT, TIMELINE_START } from '@/lib/schedule-data';
import { Pencil, ChevronDown } from 'lucide-react';

interface TimelineBlockProps {
  block: ScheduleBlock;
  index: number;
  isActive: boolean;
  isPast: boolean;
}

export function TimelineBlock({ block, index, isActive, isPast }: TimelineBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[block.category];

  const top = (block.startHour - TIMELINE_START) * HOUR_HEIGHT;
  const height = (block.endHour - block.startHour) * HOUR_HEIGHT;
  const duration = getDurationText(block.startHour, block.endHour);

  const maxPreviewTasks = 3;
  const visibleTasks = expanded ? block.tasks : block.tasks.slice(0, maxPreviewTasks);
  const hiddenCount = block.tasks.length - maxPreviewTasks;

  return (
    <div
      className="absolute left-0 right-0 mx-0.5 sm:mx-1 group"
      style={{
        top: `${top}px`,
        height: `${Math.max(height - 2, 40)}px`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        className={`
          relative h-full rounded-xl border overflow-hidden
          transition-all duration-300 ease-out cursor-pointer
          hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30
          hover:-translate-y-[1px] hover:scale-[1.005]
          ${isActive ? 'ring-2 ring-offset-1 ring-offset-background shadow-lg' : ''}
          ${isPast ? 'opacity-60' : 'opacity-100'}
          animate-in fade-in slide-in-from-left-2
        `}
        style={{
          borderColor: isActive ? meta.color : `${meta.color}25`,
          boxShadow: isActive ? `0 0 0 2px ${meta.color}` : undefined,
          background: `linear-gradient(135deg, ${meta.color}08 0%, transparent 60%)`,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left color strip */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: meta.color }}
        />

        {/* Active pulse indicator */}
        {isActive && (
          <div className="absolute top-3 right-3">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: meta.color }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: meta.color }}
              />
            </span>
          </div>
        )}

        {/* Content */}
        <div className="h-full pl-4 pr-3 py-2.5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[13px] font-semibold text-foreground truncate">
                  {block.title}
                </h4>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                  style={{
                    backgroundColor: `${meta.color}15`,
                    color: meta.color,
                  }}
                >
                  {duration}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground font-mono tabular-nums">
                {formatTimeRange(block.startHour, block.endHour)}
              </p>
            </div>

            {/* Hover actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="rounded-md p-1 hover:bg-accent transition-colors"
                onClick={(e) => { e.stopPropagation(); }}
                aria-label="Edit block"
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
              {hiddenCount > 0 && (
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              )}
            </div>
          </div>

          {/* Tasks — table-style rows */}
          {height > 60 && (
            <div className="mt-2 flex-1 overflow-hidden">
              <div className="space-y-0.5">
                {visibleTasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-0.5 animate-in fade-in"
                    style={{ animationDelay: `${(index * 60) + (i * 40)}ms` }}
                  >
                    <div
                      className="h-1 w-1 rounded-full shrink-0"
                      style={{ backgroundColor: `${meta.color}80` }}
                    />
                    <span className="text-[11px] text-muted-foreground/90 truncate leading-relaxed">
                      {task}
                    </span>
                  </div>
                ))}
                {!expanded && hiddenCount > 0 && (
                  <p
                    className="text-[10px] font-semibold mt-1 pl-3"
                    style={{ color: meta.color }}
                  >
                    +{hiddenCount} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 1px 0 ${meta.color}10, 0 4px 24px ${meta.color}08`,
          }}
        />
      </div>
    </div>
  );
}
