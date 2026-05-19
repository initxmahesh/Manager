'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DAY_TABS,
  DayTabKey,
  SCHEDULES,
  ScheduleBlock,
  CATEGORY_META,
  ScheduleCategory,
  formatHour,
  getDurationText,
  getCurrentHourPosition,
} from '@/lib/schedule-data';
import { useScheduleTracking } from '@/hooks/useScheduleTracking';
import { format } from 'date-fns';
import { RotateCcw, Check, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── EMOJI & DECORATION MAPS ────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<ScheduleCategory, string> = {
  loksewa: '📚',
  software: '💻',
  mental: '🧘',
  life: '☕',
};

const CATEGORY_BG: Record<ScheduleCategory, string> = {
  loksewa: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40',
  software: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40',
  mental: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40',
  life: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/40',
};

const BLOCK_DECORATIONS: Record<string, string> = {
  'Morning': '🌅',
  'Lunch': '🍱',
  'Dinner': '🍽️',
  'Break': '🍵',
  'Exercise': '🏃',
  'Sleep': '😴',
  'Brunch': '🥐',
  'Wind': '🌙',
  'Mock': '📝',
  'Job': '💼',
  'Review': '🔄',
  'Creative': '🎨',
  'Nature': '🌿',
  'Free': '🎉',
  'Rest': '💤',
  'Week': '📋',
};

function getBlockEmoji(title: string, category: ScheduleCategory): string {
  for (const [key, emoji] of Object.entries(BLOCK_DECORATIONS)) {
    if (title.includes(key)) return emoji;
  }
  return CATEGORY_EMOJI[category];
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getDefaultTab(): DayTabKey {
  const day = new Date().getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  if (day === 2 || day === 4) return 'tth';
  return 'mwf';
}

// ─── LIVE CLOCK ─────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const isAM = hours < 12;
  const displayH = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const mins = String(time.getMinutes()).padStart(2, '0');
  const secs = String(time.getSeconds()).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">⏰</span>
      <div>
        <span className="text-lg font-bold font-mono tabular-nums">
          {displayH}:{mins}
          <span className="text-sm text-muted-foreground">:{secs}</span>
        </span>
        <span className={cn(
          'ml-2 text-xs font-bold px-2 py-0.5 rounded-full',
          isAM
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        )}>
          {isAM ? '☀️ AM' : '🌙 PM'}
        </span>
      </div>
    </div>
  );
}

// ─── TASK CHECKBOX ──────────────────────────────────────────────────────────

function TaskCheckbox({ task, checked, onToggle, color }: {
  task: string; checked: boolean; onToggle: () => void; color: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="flex items-center gap-2.5 w-full text-left py-1.5 group/task"
    >
      <div
        className={cn(
          'h-[18px] w-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200',
          checked ? 'border-transparent scale-105' : 'border-gray-300 dark:border-gray-600 group-hover/task:border-gray-400'
        )}
        style={checked ? { backgroundColor: color } : undefined}
      >
        {checked && <Check className="h-3 w-3 text-white animate-tick-bounce" />}
      </div>
      <span className={cn(
        'text-sm leading-snug transition-all duration-200',
        checked
          ? 'text-muted-foreground/40 line-through decoration-2'
          : 'text-foreground/80 group-hover/task:text-foreground'
      )}>
        {task}
      </span>
      {checked && <span className="text-xs ml-auto">✅</span>}
    </button>
  );
}

// ─── SCHEDULE BLOCK CARD ────────────────────────────────────────────────────

function BlockCard({ block, index, isActive, isPast, completedTasks, onToggleTask }: {
  block: ScheduleBlock;
  index: number;
  isActive: boolean;
  isPast: boolean;
  completedTasks: Set<string>;
  onToggleTask: (blockId: string, taskIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState(isActive);
  const meta = CATEGORY_META[block.category];
  const emoji = getBlockEmoji(block.title, block.category);
  const duration = getDurationText(block.startHour, block.endHour);

  const completedCount = block.tasks.filter((_, i) => completedTasks.has(`${block.id}-${i}`)).length;
  const progressPercent = block.tasks.length > 0 ? Math.round((completedCount / block.tasks.length) * 100) : 0;

  return (
    <div
      className={cn(
        'animate-row-enter rounded-xl border-2 overflow-hidden transition-all duration-300',
        CATEGORY_BG[block.category],
        isActive && 'ring-2 ring-offset-2 ring-offset-background shadow-lg',
        isPast && 'opacity-50 saturate-50',
        !isPast && !isActive && 'hover:shadow-md hover:-translate-y-0.5',
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        ...(isActive ? { '--tw-ring-color': meta.color } as React.CSSProperties : {}),
      }}
    >
      {/* Block Header */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                'text-[15px] font-bold truncate',
                isPast && 'line-through decoration-2 decoration-muted-foreground/30'
              )}>
                {block.title}
              </h3>
              {isActive && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                  🔥 NOW
                </span>
              )}
              {progressPercent === 100 && (
                <span className="text-xs">🎉</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
              <span className="font-mono tabular-nums font-medium">
                {formatHour(block.startHour)} → {formatHour(block.endHour)}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>{duration}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{block.tasks.length} tasks</span>
            </p>
          </div>
        </div>

        {/* Progress circle */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative h-10 w-10">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" className="stroke-muted/30" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                strokeWidth="3" strokeLinecap="round"
                style={{
                  stroke: progressPercent === 100 ? '#1D9E75' : progressPercent > 0 ? meta.color : '#d1d5db',
                  strokeDasharray: `${progressPercent * 0.942} 100`,
                  transition: 'stroke-dasharray 0.5s ease',
                }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="px-4 pb-3">
        <div className="bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2 space-y-0">
          {(expanded ? block.tasks : block.tasks.slice(0, 3)).map((task, i) => (
            <TaskCheckbox
              key={i}
              task={task}
              checked={completedTasks.has(`${block.id}-${i}`)}
              onToggle={() => onToggleTask(block.id, i)}
              color={meta.color}
            />
          ))}
          {block.tasks.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold mt-1 py-1 transition-colors flex items-center gap-1"
              style={{ color: meta.color }}
            >
              {expanded ? '⬆️ Show less' : `⬇️ +${block.tasks.length - 3} more tasks`}
            </button>
          )}
        </div>

        {/* Duration bar visualization */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-[3px] flex-1">
            {Array.from({ length: Math.min(Math.round((block.endHour - block.startHour) * 2), 12) }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i < Math.round((progressPercent / 100) * Math.round((block.endHour - block.startHour) * 2))
                    ? meta.color
                    : `${meta.color}25`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
            {completedCount}/{block.tasks.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── NOW INDICATOR ──────────────────────────────────────────────────────────

function NowIndicator() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg shadow-red-500/20 shrink-0">
        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Now</span>
      </div>
      <div className="flex-1 h-[2px] bg-gradient-to-r from-red-400 via-red-300 to-transparent rounded-full" />
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function DailyTimelineTable() {
  const [activeTab, setActiveTab] = useState<DayTabKey>(getDefaultTab);
  const [currentHour, setCurrentHour] = useState(getCurrentHourPosition);
  const [mounted, setMounted] = useState(false);

  const blocks = SCHEDULES[activeTab];
  const today = new Date().toISOString().split('T')[0];

  const { completedTasks, loading: trackingLoading, syncing, toggleTask, resetDay } = useScheduleTracking(today, activeTab);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(getCurrentHourPosition()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = useCallback((blockId: string, taskIndex: number) => {
    const blockData = blocks.map(b => ({ id: b.id, title: b.title, category: b.category, tasks: b.tasks }));
    toggleTask(blockId, taskIndex, blockData);
  }, [blocks, toggleTask]);

  const handleReset = () => {
    const blockData = blocks.map(b => ({ id: b.id, title: b.title, category: b.category, tasks: b.tasks }));
    resetDay(blockData);
  };

  const activeBlockIndex = blocks.findIndex(b => currentHour >= b.startHour && currentHour < b.endHour);
  const totalTasks = blocks.reduce((sum, b) => sum + b.tasks.length, 0);
  const totalCompleted = [...completedTasks].filter(key => {
    const blockId = key.substring(0, key.lastIndexOf('-'));
    return blocks.some(b => b.id === blockId);
  }).length;
  const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const categoryStats = (Object.entries(CATEGORY_META) as [ScheduleCategory, typeof CATEGORY_META[ScheduleCategory]][])
    .map(([key, meta]) => ({
      key,
      meta,
      hours: blocks.filter(b => b.category === key).reduce((s, b) => s + (b.endHour - b.startHour), 0),
    }))
    .filter(c => c.hours > 0);

  const totalHours = blocks.reduce((s, b) => s + (b.endHour - b.startHour), 0);

  if (!mounted || trackingLoading) {
    return <div className="h-96 rounded-2xl border bg-card animate-pulse" />;
  }

  return (
    <div className="w-full space-y-6">

      {/* ═══════════ HEADER ═══════════ */}
      <div className="rounded-2xl border-2 border-pink-200 dark:border-pink-900/30 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-pink-950/10 dark:via-card dark:to-purple-950/10 overflow-hidden shadow-sm">
        <div className="px-5 sm:px-7 py-6">
          {/* Title with decorations */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                  Weekly Study Schedule
                  <span className="text-lg">✨</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Balanced Study • Focus • Consistency • You Can Do It! 💪❤️
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LiveClock />
            </div>
          </div>

          {/* Date display */}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>📅</span>
            <span className="font-medium text-foreground">{format(new Date(), 'EEEE')}</span>
            <span>•</span>
            <span>{format(new Date(), 'd MMMM yyyy')}</span>
            {syncing && (
              <span className="ml-2 text-xs text-blue-500 animate-pulse">☁️ Syncing...</span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-5 p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold flex items-center gap-2">
                🎯 Today&apos;s Progress
              </span>
              <span className="text-sm font-bold tabular-nums">
                {totalCompleted}/{totalTasks} tasks done
                {overallProgress === 100 && ' 🏆'}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out',
                  overallProgress === 100
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                    : overallProgress > 50
                    ? 'bg-gradient-to-r from-blue-400 to-emerald-400'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400'
                )}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {categoryStats.map(({ key, meta, hours }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span>{CATEGORY_EMOJI[key as ScheduleCategory]}</span>
                  <span className="text-xs text-muted-foreground">{meta.label}:</span>
                  <span className="text-xs font-bold">{hours}h</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-auto">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-bold">~{totalHours}h total ⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="border-t border-pink-200/50 dark:border-pink-900/20 bg-white/40 dark:bg-white/5 px-5 sm:px-7 py-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2">
            {DAY_TABS.map((tab) => {
              const tabEmojis: Record<DayTabKey, string> = { mwf: '📗', tth: '📘', saturday: '📙', sunday: '📕' };
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-1.5',
                    activeTab === tab.key
                      ? 'bg-foreground text-background shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/10 hover:shadow-sm'
                  )}
                >
                  <span>{tabEmojis[tab.key]}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
            <button
              onClick={handleReset}
              className="shrink-0 ml-auto rounded-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
              title="Reset all completions"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ SCHEDULE BLOCKS ═══════════ */}
      <div className="space-y-3">
        {blocks.map((block, i) => {
          const isActive = i === activeBlockIndex;
          const isPast = block.endHour <= currentHour;

          return (
            <div key={block.id}>
              {isActive && <NowIndicator />}
              <BlockCard
                block={block}
                index={i}
                isActive={isActive}
                isPast={isPast}
                completedTasks={completedTasks}
                onToggleTask={handleToggleTask}
              />
            </div>
          );
        })}
      </div>

      {/* ═══════════ FOOTER STATS ═══════════ */}
      <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/30 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/10 dark:to-yellow-950/10 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-base font-bold">Total Study: ~{totalHours} hours</span>
            <span className="text-xl">📚</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            &ldquo;It&apos;s not about perfect, it&apos;s about progress. Keep showing up every day!&rdquo; ❤️
          </p>
        </div>
      </div>

      {/* ═══════════ TIPS SECTION ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tips for Success */}
        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/80 dark:bg-emerald-950/10 p-5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
            ✅ Tips for Success
          </h3>
          <ul className="space-y-2.5">
            {[
              { emoji: '🎯', text: 'Stay consistent' },
              { emoji: '🔇', text: 'No distractions while studying' },
              { emoji: '☕', text: 'Take short breaks (10 min)' },
              { emoji: '💧', text: 'Stay hydrated & eat healthy' },
              { emoji: '😴', text: 'Get enough sleep (10:30 PM)' },
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span>{tip.emoji}</span>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Study Method */}
        <div className="rounded-xl border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50/80 dark:bg-blue-950/10 p-5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
            📝 Study Method
          </h3>
          <ul className="space-y-2.5">
            {[
              { emoji: '⏱️', text: '45-50 min study + 10 min break' },
              { emoji: '🔄', text: 'Daily revision zaroor karo' },
              { emoji: '📵', text: 'Phone ko side ma rakhne' },
              { emoji: '🎯', text: 'Focus > Quantity' },
              { emoji: '🔑', text: 'Consistency is the key to success' },
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span>{tip.emoji}</span>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Remember */}
        <div className="rounded-xl border-2 border-amber-200 dark:border-amber-900/30 bg-amber-50/80 dark:bg-amber-950/10 p-5 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
            💡 Remember
          </h3>
          <ul className="space-y-2.5">
            {[
              { emoji: '🌙', text: 'Plan your day the night before' },
              { emoji: '📖', text: 'Revise regularly' },
              { emoji: '💪', text: 'Believe in yourself' },
              { emoji: '🏆', text: 'Small progress is still progress' },
              { emoji: '❤️', text: 'Be proud of how hard you are trying' },
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span>{tip.emoji}</span>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══════════ MOTIVATIONAL FOOTER ═══════════ */}
      <div className="text-center py-4">
        <p className="text-base font-medium text-muted-foreground italic">
          🌸 &ldquo;Be proud of how hard you are trying.&rdquo; 🌸
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Stay Consistent! 🌟
        </p>
      </div>
    </div>
  );
}
