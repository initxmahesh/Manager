'use client';

import { usePolling } from './usePolling';
import { useOptimistic } from './useOptimistic';
import { WeeklyGoal } from '@/lib/types';

export function useWeekly() {
  const { data, loading, lastSynced, refetch, setData, pendingIds, setPendingIds } = usePolling<WeeklyGoal>('/api/weekly');
  const { optimisticCreate, optimisticUpdate, optimisticDelete } = useOptimistic<WeeklyGoal>(data, setData, pendingIds, setPendingIds);

  const createGoal = async (goal: Omit<WeeklyGoal, 'id'>) => {
    const tempId = crypto.randomUUID();
    const tempGoal: WeeklyGoal = { id: tempId, ...goal };
    await optimisticCreate(tempGoal, async () => {
      const res = await fetch('/api/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('Failed to create goal');
      return res.json();
    });
  };

  const updateGoal = async (id: string, updates: Partial<WeeklyGoal>) => {
    await optimisticUpdate(
      id,
      (goal) => ({ ...goal, ...updates }),
      async () => {
        const res = await fetch(`/api/weekly/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update goal');
        return res.json();
      }
    );
  };

  const deleteGoal = async (id: string) => {
    await optimisticDelete(id, async () => {
      const res = await fetch(`/api/weekly/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete goal');
    });
  };

  return { goals: data, loading, lastSynced, refetch, createGoal, updateGoal, deleteGoal };
}
