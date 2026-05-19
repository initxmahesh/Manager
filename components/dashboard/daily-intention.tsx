'use client';

import { useState, useEffect } from 'react';
import { getTodayQuote } from '@/lib/motivation-data';
import { cn } from '@/lib/utils';

export function DailyIntention() {
  const [intention, setIntention] = useState('');
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const quote = getTodayQuote();

  // Load from localStorage (keyed by date — resets daily)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`intention-${today}`);
      if (stored) {
        setIntention(stored);
        setSaved(true);
      }
    } catch { /* ignore */ }
  }, [today]);

  const handleSave = () => {
    if (intention.trim()) {
      try { localStorage.setItem(`intention-${today}`, intention.trim()); } catch { /* ignore */ }
      setSaved(true);
      setEditing(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-900/30 bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-violet-950/10 dark:via-card dark:to-pink-950/10 p-5 overflow-hidden">
      {/* Quote of the day */}
      <div className="mb-4 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-border/30">
        <p className="text-sm italic text-foreground/80 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
          <span>—</span>
          <span className="font-medium">{quote.author}</span>
          {quote.context && <span className="text-muted-foreground/60">({quote.context})</span>}
        </p>
      </div>

      {/* Intention setter */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎯</span>
          <h3 className="text-sm font-bold">Today&apos;s Non-Negotiable</h3>
        </div>

        {saved && !editing ? (
          <div
            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800/40 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => setEditing(true)}
          >
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <span>✅</span>
              {intention}
            </p>
            <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 mt-1">
              Tap to edit • Set for today
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="What's your one non-negotiable for today?"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-violet-200 dark:border-violet-800/40 bg-white dark:bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-700 transition-all"
              autoFocus={editing}
            />
            <button
              onClick={handleSave}
              disabled={!intention.trim()}
              className={cn(
                'w-full py-2 rounded-xl text-sm font-semibold transition-all',
                intention.trim()
                  ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {saved ? '💾 Update Intention' : '🚀 Set My Intention'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
