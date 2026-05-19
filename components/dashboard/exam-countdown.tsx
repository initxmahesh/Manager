'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, format, parseISO } from 'date-fns';

export function ExamCountdown() {
  const [examDate, setExamDate] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('exam-date');
      if (stored) setExamDate(stored);
    } catch { /* ignore */ }
  }, []);

  const handleSave = (date: string) => {
    setExamDate(date);
    setEditing(false);
    try { localStorage.setItem('exam-date', date); } catch { /* ignore */ }
  };

  if (!mounted) return null;

  const now = new Date();
  const daysLeft = examDate ? differenceInDays(parseISO(examDate), now) : null;
  const hoursLeft = examDate ? differenceInHours(parseISO(examDate), now) % 24 : null;

  // Urgency color
  const urgencyColor = daysLeft === null ? 'text-muted-foreground'
    : daysLeft <= 7 ? 'text-red-600 dark:text-red-400'
    : daysLeft <= 30 ? 'text-amber-600 dark:text-amber-400'
    : 'text-emerald-600 dark:text-emerald-400';

  const urgencyBg = daysLeft === null ? 'border-border'
    : daysLeft <= 7 ? 'border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-950/10'
    : daysLeft <= 30 ? 'border-amber-300 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/10'
    : 'border-emerald-300 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/10';

  return (
    <div className={`rounded-2xl border-2 p-5 transition-colors ${urgencyBg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h3 className="text-sm font-bold">PSC Exam Countdown</h3>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
        >
          {editing ? 'Cancel' : '⚙️ Set Date'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            type="date"
            defaultValue={examDate}
            onChange={(e) => handleSave(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[11px] text-muted-foreground">Select your PSC/NTC exam date</p>
        </div>
      ) : examDate && daysLeft !== null ? (
        <div className="text-center py-2">
          <div className={`text-5xl font-extrabold tabular-nums ${urgencyColor}`}>
            {daysLeft}
          </div>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            days {daysLeft >= 0 ? 'remaining' : 'overdue'}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>📆 {format(parseISO(examDate), 'EEEE, d MMMM yyyy')}</span>
          </div>
          {daysLeft > 0 && daysLeft <= 60 && (
            <p className="mt-3 text-xs font-medium px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/5 inline-block">
              {daysLeft <= 7 ? '⚠️ Final week! Maximum focus!' :
               daysLeft <= 14 ? '🔥 2 weeks! Revision mode!' :
               daysLeft <= 30 ? '💪 1 month! Stay disciplined!' :
               '📚 Keep the momentum going!'}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Set your exam date to see the countdown ⏰
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            + Add exam date
          </button>
        </div>
      )}
    </div>
  );
}
