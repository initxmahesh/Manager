'use client';

import { usePolling } from './usePolling';
import { useOptimistic } from './useOptimistic';
import { JobApplication } from '@/lib/types';

export function useJobs() {
  const { data, loading, lastSynced, refetch, setData, pendingIds, setPendingIds } = usePolling<JobApplication>('/api/jobs');
  const { optimisticCreate, optimisticUpdate, optimisticDelete } = useOptimistic<JobApplication>(data, setData, pendingIds, setPendingIds);

  const createJob = async (job: Omit<JobApplication, 'id'>) => {
    const tempId = crypto.randomUUID();
    const tempJob: JobApplication = { id: tempId, ...job };
    await optimisticCreate(tempJob, async () => {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error('Failed to create job');
      return res.json();
    });
  };

  const updateJob = async (id: string, updates: Partial<JobApplication>) => {
    await optimisticUpdate(
      id,
      (job) => ({ ...job, ...updates }),
      async () => {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update job');
        return res.json();
      }
    );
  };

  const deleteJob = async (id: string) => {
    await optimisticDelete(id, async () => {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
    });
  };

  return { jobs: data, loading, lastSynced, refetch, createJob, updateJob, deleteJob };
}
