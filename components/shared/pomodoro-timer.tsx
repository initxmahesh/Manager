'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

type TimerPhase = 'focus' | 'break' | 'idle';
type TimerTheme = 'forest' | 'ocean' | 'sunset' | 'night' | 'sakura';

const THEMES: Record<TimerTheme, { bg: string; accent: string; emoji: string; label: string; illustration: string }> = {
  forest: {
    bg: 'from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/20',
    accent: '#10B981',
    emoji: '🌲',
    label: 'Forest Focus',
    illustration: '🌿🌳🍃🦋',
  },
  ocean: {
    bg: 'from-blue-50 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/20',
    accent: '#0EA5E9',
    emoji: '🌊',
    label: 'Ocean Calm',
    illustration: '🐚🌊🐠🦀',
  },
  sunset: {
    bg: 'from-orange-50 to-rose-100 dark:from-orange-950/30 dark:to-rose-950/20',
    accent: '#F97316',
    emoji: '🌅',
    label: 'Sunset Warmth',
    illustration: '🌅🌻☀️🦅',
  },
  night: {
    bg: 'from-indigo-50 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/20',
    accent: '#8B5CF6',
    emoji: '🌙',
    label: 'Night Owl',
    illustration: '🌙✨🦉💫',
  },
  sakura: {
    bg: 'from-pink-50 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/20',
    accent: '#EC4899',
    emoji: '🌸',
    label: 'Sakura Love',
    illustration: '🌸💕🦢🌷',
  },
};

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

export function PomodoroTimer() {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [theme, setTheme] = useState<TimerTheme>('sakura');
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTheme = THEMES[theme];

  // Load saved pomodoros
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`pomodoro-${today}`);
      if (saved) setPomodorosCompleted(parseInt(saved) || 0);
    } catch { /* ignore */ }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);
      if (phase === 'focus') {
        const newCount = pomodorosCompleted + 1;
        setPomodorosCompleted(newCount);
        try {
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem(`pomodoro-${today}`, String(newCount));
        } catch { /* ignore */ }
        setPhase('break');
        setTimeLeft(BREAK_DURATION);
      } else {
        setPhase('idle');
        setTimeLeft(FOCUS_DURATION);
      }
      // Play notification sound (browser API)
      try { new Audio('/notification.mp3').play().catch(() => {}); } catch { /* ignore */ }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, phase, pomodorosCompleted]);

  const startFocus = () => {
    setPhase('focus');
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(true);
  };

  const startBreak = () => {
    setPhase('break');
    setTimeLeft(BREAK_DURATION);
    setIsRunning(true);
  };

  const togglePause = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(FOCUS_DURATION);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = phase === 'focus' ? FOCUS_DURATION : phase === 'break' ? BREAK_DURATION : FOCUS_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className={cn(
      'rounded-2xl border-2 overflow-hidden transition-all duration-500',
      `bg-gradient-to-br ${currentTheme.bg}`,
      phase === 'focus' ? 'border-amber-300 dark:border-amber-800/50' :
      phase === 'break' ? 'border-emerald-300 dark:border-emerald-800/50' :
      'border-border'
    )}>
      {/* Theme selector */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentTheme.emoji}</span>
          <span className="text-xs font-semibold text-muted-foreground">{currentTheme.label}</span>
        </div>
        <div className="flex gap-1">
          {(Object.keys(THEMES) as TimerTheme[]).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                'h-5 w-5 rounded-full text-[10px] flex items-center justify-center transition-all',
                theme === t ? 'scale-125 ring-2 ring-offset-1 ring-offset-background' : 'opacity-50 hover:opacity-100'
              )}
              style={{ ringColor: THEMES[t].accent }}
            >
              {THEMES[t].emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Illustration */}
      <div className="text-center py-2 text-2xl tracking-[0.5em] opacity-40 select-none">
        {currentTheme.illustration}
      </div>

      {/* Timer display */}
      <div className="text-center px-4 pb-2">
        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="h-36 w-36 sm:h-44 sm:w-44 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-muted/20" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              strokeWidth="4" strokeLinecap="round"
              style={{
                stroke: currentTheme.accent,
                strokeDasharray: `${progress * 2.64} 264`,
                transition: 'stroke-dasharray 1s linear',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className={cn(
              'text-[11px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full',
              phase === 'focus' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
              phase === 'break' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
              'bg-muted text-muted-foreground'
            )}>
              {phase === 'focus' ? '🎯 Focus' : phase === 'break' ? '☕ Break' : '⏸️ Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4 flex items-center justify-center gap-3">
        {phase === 'idle' ? (
          <button
            onClick={startFocus}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: currentTheme.accent }}
          >
            ▶️ Start Focus (25 min)
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: currentTheme.accent, color: currentTheme.accent }}
            >
              {isRunning ? '⏸ Pause' : '▶️ Resume'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              ↺ Reset
            </button>
          </>
        )}
      </div>

      {/* Pomodoro count */}
      <div className="border-t px-4 py-3 flex items-center justify-between" style={{ borderColor: `${currentTheme.accent}20` }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🍅</span>
          <span className="text-xs font-medium">Today: <strong>{pomodorosCompleted}</strong> pomodoros</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(pomodorosCompleted, 8) }).map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: currentTheme.accent }} />
          ))}
          {pomodorosCompleted > 8 && (
            <span className="text-[10px] text-muted-foreground ml-1">+{pomodorosCompleted - 8}</span>
          )}
        </div>
      </div>

      {/* Motivational message */}
      {phase === 'focus' && isRunning && (
        <div className="px-4 pb-3 text-center">
          <p className="text-[11px] text-muted-foreground italic animate-pulse">
            {theme === 'sakura' ? '💕 You are doing amazing, keep going...' :
             theme === 'forest' ? '🌿 Deep breath. One step at a time.' :
             theme === 'ocean' ? '🌊 Flow with focus, like the ocean waves.' :
             theme === 'sunset' ? '🌅 Every minute of effort brings you closer.' :
             '✨ The night is quiet. Your mind is sharp.'}
          </p>
        </div>
      )}
      {phase === 'break' && (
        <div className="px-4 pb-3 text-center">
          <p className="text-[11px] text-muted-foreground italic">
            ☕ Rest your eyes. Stretch. Breathe. You earned this break. 💛
          </p>
        </div>
      )}
    </div>
  );
}
