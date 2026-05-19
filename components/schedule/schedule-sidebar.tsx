'use client';

import { useState, useEffect } from 'react';
import { ScheduleBlock, CATEGORY_META, formatHour, getCurrentHourPosition, getDurationText } from '@/lib/schedule-data';
import { AnalogClock } from './analog-clock';
import { CategoryChart } from './category-chart';
import { Clock, Zap, ChevronRight, RotateCcw } from 'lucide-react';

interface ScheduleSidebarProps {
  blocks: ScheduleBlock[];
  overrideHour: number | null;
  onTimeChange: (hour: number | null) => void;
}

export function ScheduleSidebar({ blocks, overrideHour, onTimeChange }: ScheduleSidebarProps) {
  const [currentHour, setCurrentHour] = useState(getCurrentHourPosition);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(getCurrentHourPosition());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const displayHour = overrideHour ?? currentHour;

  // Find current and next block
  const currentBlock = blocks.find(b => displayHour >= b.startHour && displayHour < b.endHour);
  const nextBlock = blocks.find(b => b.startHour > displayHour);

  // Calculate progress
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter(b => b.endHour <= displayHour).length;
  const progress = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  // Remaining hours
  const lastBlock = blocks[blocks.length - 1];
  const remainingHours = lastBlock ? Math.max(0, lastBlock.endHour - displayHour) : 0;

  return (
    <div className="space-y-5">
      {/* Analog Clock */}
      <div className="flex flex-col items-center">
        <AnalogClock
          overrideHour={overrideHour}
          onTimeChange={(h) => onTimeChange(h)}
          adjustable
        />
        {overrideHour !== null && (
          <button
            onClick={() => onTimeChange(null)}
            className="mt-2 flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to real time
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-right-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Progress</span>
          <span className="text-xs font-bold tabular-nums">{completedBlocks}/{totalBlocks}</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold tabular-nums">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Block */}
      {currentBlock && (
        <div
          className="rounded-xl border p-4 animate-in fade-in slide-in-from-right-2"
          style={{
            borderColor: `${CATEGORY_META[currentBlock.category].color}30`,
            background: `linear-gradient(135deg, ${CATEGORY_META[currentBlock.category].color}06 0%, transparent 100%)`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5" style={{ color: CATEGORY_META[currentBlock.category].color }} />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Current</span>
          </div>
          <p className="text-sm font-semibold">{currentBlock.title}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Until {formatHour(currentBlock.endHour)} · {getDurationText(displayHour, currentBlock.endHour)} left
          </p>
          <div className="mt-2.5 h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, ((displayHour - currentBlock.startHour) / (currentBlock.endHour - currentBlock.startHour)) * 100)}%`,
                backgroundColor: CATEGORY_META[currentBlock.category].color,
              }}
            />
          </div>
        </div>
      )}

      {/* Next Block */}
      {nextBlock && (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-right-2">
          <div className="flex items-center gap-2 mb-2">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Up Next</span>
          </div>
          <p className="text-sm font-semibold">{nextBlock.title}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {formatHour(nextBlock.startHour)} · {getDurationText(nextBlock.startHour, nextBlock.endHour)}
          </p>
        </div>
      )}

      {/* Remaining */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-right-2">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Remaining</span>
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {Math.floor(remainingHours)}h {Math.round((remainingHours % 1) * 60)}m
        </p>
      </div>

      {/* Category Distribution */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-right-2">
        <CategoryChart blocks={blocks} />
      </div>
    </div>
  );
}
