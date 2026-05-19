'use client';

import { usePolling } from './usePolling';
import { useOptimistic } from './useOptimistic';
import { DailyTask } from '@/lib/types';

export function useTasks() {
  const { data, loading, lastSynced, refetch, setData, pendingIds, setPendingIds } = usePolling<DailyTask>('/api/tasks');
  const { optimisticCreate, optimisticUpdate, optimisticDelete } = useOptimistic<DailyTask>(data, setData, pendingIds, setPendingIds);

  const createTask = async (task: Omit<DailyTask, 'id'>) => {
    const tempId = crypto.randomUUID();
    const tempTask: DailyTask = { id: tempId, ...task };
    await optimisticCreate(tempTask, async () => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    });
  };

  const updateTask = async (id: string, updates: Partial<DailyTask>) => {
    await optimisticUpdate(
      id,
      (task) => ({ ...task, ...updates }),
      async () => {
        const res = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
      }
    );
  };

  const deleteTask = async (id: string) => {
    await optimisticDelete(id, async () => {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    });
  };

  return { tasks: data, loading, lastSynced, refetch, createTask, updateTask, deleteTask };
}
