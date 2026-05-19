'use client';

import { usePolling } from './usePolling';
import { useOptimistic } from './useOptimistic';
import { LoksewaEntry } from '@/lib/types';

export function useLoksewa() {
  const { data, loading, lastSynced, refetch, setData, pendingIds, setPendingIds } = usePolling<LoksewaEntry>('/api/loksewa');
  const { optimisticCreate, optimisticUpdate, optimisticDelete } = useOptimistic<LoksewaEntry>(data, setData, pendingIds, setPendingIds);

  const createEntry = async (entry: Omit<LoksewaEntry, 'id' | 'score_percent'>) => {
    const tempId = crypto.randomUUID();
    const scorePercent = Math.round((entry.questions_correct / entry.questions_attempted) * 100);
    const tempEntry: LoksewaEntry = { id: tempId, ...entry, score_percent: scorePercent };
    await optimisticCreate(tempEntry, async () => {
      const res = await fetch('/api/loksewa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error('Failed to create entry');
      return res.json();
    });
  };

  const updateEntry = async (id: string, updates: Partial<LoksewaEntry>) => {
    await optimisticUpdate(
      id,
      (entry) => {
        const updated = { ...entry, ...updates };
        if (updates.questions_attempted !== undefined || updates.questions_correct !== undefined) {
          updated.score_percent = Math.round((updated.questions_correct / updated.questions_attempted) * 100);
        }
        return updated;
      },
      async () => {
        const res = await fetch(`/api/loksewa/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update entry');
        return res.json();
      }
    );
  };

  const deleteEntry = async (id: string) => {
    await optimisticDelete(id, async () => {
      const res = await fetch(`/api/loksewa/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete entry');
    });
  };

  return { entries: data, loading, lastSynced, refetch, createEntry, updateEntry, deleteEntry };
}
