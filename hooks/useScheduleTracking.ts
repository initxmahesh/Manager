'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScheduleCompletion } from '@/lib/types';

interface DailySummary {
  date: string;
  weekday: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  categories: Record<string, { completed: number; total: number }>;
  blocks_touched: string[];
}

interface HistoryData {
  summaries: DailySummary[];
  streak: number;
  total_days_tracked: number;
  avg_completion_rate: number;
}

/**
 * Hook for tracking schedule completions per day.
 * 
 * KEY BEHAVIOR: The UI resets every new day automatically.
 * - `date` param is today's date (YYYY-MM-DD)
 * - On load, fetches only today's completions from the API
 * - If API has no data for today → UI starts fresh (empty checkboxes)
 * - Previous days' data stays in the Google Sheet permanently
 * - localStorage is keyed per date, so old days don't bleed into new ones
 */
export function useScheduleTracking(date: string, dayType: string) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load today's completions from API (fresh start each day)
  useEffect(() => {
    let cancelled = false;

    async function loadCompletions() {
      setLoading(true);
      setCompletedTasks(new Set()); // Start empty — fresh day

      try {
        const res = await fetch(`/api/schedule-tracking?date=${date}`);
        if (res.ok && !cancelled) {
          const entries: ScheduleCompletion[] = await res.json();
          const completed = new Set<string>();
          entries.forEach(e => {
            if (e.completed) {
              completed.add(`${e.block_id}-${e.task_index}`);
            }
          });
          setCompletedTasks(completed);
        }
      } catch (err) {
        console.error('Failed to load schedule tracking:', err);
        // Fallback: try localStorage for today only
        if (!cancelled) {
          try {
            const saved = localStorage.getItem(`schedule-${date}`);
            if (saved) setCompletedTasks(new Set(JSON.parse(saved)));
          } catch { /* ignore */ }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCompletions();
    cleanupOldLocalStorage(date);

    return () => { cancelled = true; };
  }, [date]);

  // Debounced sync to server
  const syncToServer = useCallback((tasks: Set<string>, blocks: Array<{ id: string; title: string; category: string; tasks: string[] }>) => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);

    syncTimeout.current = setTimeout(async () => {
      setSyncing(true);
      try {
        const completions = blocks.flatMap(block =>
          block.tasks.map((taskName, taskIndex) => ({
            block_id: block.id,
            block_title: block.title,
            category: block.category,
            task_index: taskIndex,
            task_name: taskName,
            completed: tasks.has(`${block.id}-${taskIndex}`),
          }))
        );

        await fetch('/api/schedule-tracking/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, day_type: dayType, completions }),
        });
      } catch (err) {
        console.error('Failed to sync schedule tracking:', err);
      } finally {
        setSyncing(false);
      }
    }, 2000); // 2 second debounce
  }, [date, dayType]);

  const toggleTask = useCallback((
    blockId: string,
    taskIndex: number,
    blocks: Array<{ id: string; title: string; category: string; tasks: string[] }>
  ) => {
    setCompletedTasks(prev => {
      const key = `${blockId}-${taskIndex}`;
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);

      // Save to localStorage (keyed by today's date)
      try { localStorage.setItem(`schedule-${date}`, JSON.stringify([...next])); } catch { /* ignore */ }

      // Sync to Google Sheets (debounced)
      syncToServer(next, blocks);

      return next;
    });
  }, [date, syncToServer]);

  const resetDay = useCallback(async (blocks: Array<{ id: string; title: string; category: string; tasks: string[] }>) => {
    setCompletedTasks(new Set());
    try { localStorage.removeItem(`schedule-${date}`); } catch { /* ignore */ }

    // Sync reset to server
    setSyncing(true);
    try {
      const completions = blocks.flatMap(block =>
        block.tasks.map((taskName, taskIndex) => ({
          block_id: block.id,
          block_title: block.title,
          category: block.category,
          task_index: taskIndex,
          task_name: taskName,
          completed: false,
        }))
      );

      await fetch('/api/schedule-tracking/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, day_type: dayType, completions }),
      });
    } catch (err) {
      console.error('Failed to reset schedule tracking:', err);
    } finally {
      setSyncing(false);
    }
  }, [date, dayType]);

  return { completedTasks, loading, syncing, toggleTask, resetDay };
}

/**
 * Cleans up localStorage entries older than 7 days.
 * Keeps recent days for offline fallback, removes old ones to prevent bloat.
 */
function cleanupOldLocalStorage(currentDate: string) {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('schedule-') && key !== `schedule-${currentDate}`) {
        // Extract date from key
        const keyDate = key.replace('schedule-', '');
        if (/^\d{4}-\d{2}-\d{2}$/.test(keyDate)) {
          const daysDiff = Math.floor(
            (new Date(currentDate).getTime() - new Date(keyDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff > 7) {
            keysToRemove.push(key);
          }
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch { /* ignore */ }
}

export function useScheduleHistory(days: number = 30) {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/schedule-tracking/history?days=${days}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to load schedule history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [days]);

  return { history, loading };
}
