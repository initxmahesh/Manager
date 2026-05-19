'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SUBJECTS, StudySession, LoksewaTopic } from '@/lib/loksewa-types';
import { differenceInDays, parseISO } from 'date-fns';
import { Flame, Target, Clock, BookOpen, TrendingUp, Calendar } from 'lucide-react';

interface CommandCenterProps {
  sessions: StudySession[];
  topics: LoksewaTopic[];
  onLogSession: () => void;
  onLogMock: () => void;
}

export function CommandCenter({ sessions, topics, onLogSession, onLogMock }: CommandCenterProps) {
  const [examDate, setExamDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');

  useEffect(() => {
    try {
      setExamDate(localStorage.getItem('exam-date') || '');
      setStartDate(localStorage.getItem('prep-start-date') || '');
    } catch { /* ignore */ }
  }, []);

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() + 1);
  const weekStartStr = thisWeekStart.toISOString().split('T')[0];

  const weekSessions = sessions.filter(s => s.date >= weekStartStr);
  const weekHours = Math.round(weekSessions.reduce((s, sess) => s + sess.time_spent_min, 0) / 60 * 10) / 10;
  const weekMocks = weekSessions.filter(s => s.session_type === 'mcq_practice' || s.questions_attempted > 0);
  const avgMockScore = weekMocks.length > 0
    ? Math.round(weekMocks.reduce((s, m) => s + m.score_percent, 0) / weekMocks.length)
    : 0;

  // Streak: consecutive days with at least 1 session
  let streak = 0;
  const sessionDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (sessionDates.includes(dateStr)) {
      streak++;
    } else if (i === 0) {
      continue; // today might not have a session yet
    } else {
      break;
    }
  }

  // Days into prep
  const daysIntoPrepNum = startDate ? differenceInDays(new Date(), parseISO(startDate)) : 0;
  const daysUntilExam = examDate ? differenceInDays(parseISO(examDate), new Date()) : null;

  // Smart focus: find 2 weakest subjects
  const subjectStats = DEFAULT_SUBJECTS.map(sub => {
    const subSessions = sessions.filter(s => s.subject_id === sub.id);
    const mockSessions = subSessions.filter(s => s.questions_attempted > 0);
    const avgScore = mockSessions.length > 0
      ? Math.round(mockSessions.reduce((s, m) => s + m.score_percent, 0) / mockSessions.length)
      : 0;
    const lastStudied = subSessions.length > 0
      ? subSessions.sort((a, b) => b.date.localeCompare(a.date))[0].date
      : '';
    const daysSinceLast = lastStudied ? differenceInDays(new Date(), parseISO(lastStudied)) : 999;
    // Priority score: lower avg + more days since last = higher priority
    const priority = (100 - avgScore) + (daysSinceLast * 5);
    return { ...sub, avgScore, lastStudied, daysSinceLast, priority, sessionCount: subSessions.length };
  });

  const focusSubjects = [...subjectStats].sort((a, b) => b.priority - a.priority).slice(0, 2);

  return (
    <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/10 dark:via-card dark:to-blue-950/10 overflow-hidden">
      {/* Stats Row */}
      <div className="px-5 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard emoji="📅" label="Day" value={`${daysIntoPrepNum}`} sub="of prep" />
        <StatCard
          emoji="⏰"
          label="Exam"
          value={daysUntilExam !== null ? `${daysUntilExam}` : '—'}
          sub="days left"
          alert={daysUntilExam !== null && daysUntilExam <= 30}
        />
        <StatCard emoji="🔥" label="Streak" value={`${streak}`} sub="days" />
        <StatCard emoji="📊" label="Avg Score" value={`${avgMockScore}%`} sub="this week" />
        <StatCard emoji="📚" label="Sessions" value={`${weekSessions.length}`} sub="this week" />
        <StatCard emoji="⏱️" label="Hours" value={`${weekHours}`} sub="this week" />
      </div>

      {/* Today's Focus */}
      <div className="border-t border-indigo-100 dark:border-indigo-900/20 px-5 sm:px-6 py-4 bg-white/40 dark:bg-white/5">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">🎯</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold mb-1">Today&apos;s Focus</h3>
            <div className="space-y-1.5">
              {focusSubjects.map(sub => (
                <div key={sub.id} className="flex items-center gap-2 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                  <span className="font-medium">{sub.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {sub.avgScore > 0 ? `${sub.avgScore}% avg` : 'No data yet'}
                    {sub.daysSinceLast < 999 && ` • ${sub.daysSinceLast}d ago`}
                    {sub.daysSinceLast >= 3 && sub.daysSinceLast < 999 && ' ⚠️'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onLogSession}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            Log Study Session
          </button>
          <button
            onClick={onLogMock}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Target className="h-4 w-4" />
            Log Mock Exam
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, sub, alert }: {
  emoji: string; label: string; value: string; sub: string; alert?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 bg-white/60 dark:bg-white/5 border border-border/30 ${alert ? 'border-red-300 dark:border-red-800/50' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{emoji}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-extrabold tabular-nums ${alert ? 'text-red-600 dark:text-red-400' : ''}`}>{value}</span>
        <span className="text-[10px] text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}
