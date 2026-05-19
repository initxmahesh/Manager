'use client';

import { useCallback } from 'react';

interface UseOptimisticReturn<T> {
  optimisticCreate: (item: T, apiCall: () => Promise<T>) => Promise<void>;
  optimisticUpdate: (id: string, updater: (item: T) => T, apiCall: () => Promise<unknown>) => Promise<void>;
  optimisticDelete: (id: string, apiCall: () => Promise<unknown>) => Promise<void>;
}

export function useOptimistic<T extends { id: string }>(
  data: T[] | null,
  setData: (data: T[] | null) => void,
  pendingIds: Set<string>,
  setPendingIds: React.Dispatch<React.SetStateAction<Set<string>>>
): UseOptimisticReturn<T> {
  const optimisticCreate = useCallback(async (item: T, apiCall: () => Promise<T>) => {
    const previous = data ? [...data] : [];
    setPendingIds(prev => new Set([...prev, item.id]));
    setData([...(data || []), item]);

    try {
      const created = await apiCall();
      // Replace temp item with server-created item
      setData([...(data || []).filter(i => i.id !== item.id), created]);
    } catch {
      setData(previous);
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }, [data, setData, setPendingIds]);

  const optimisticUpdate = useCallback(async (id: string, updater: (item: T) => T, apiCall: () => Promise<unknown>) => {
    const previous = data ? [...data] : [];
    setPendingIds(prev => new Set([...prev, id]));
    setData(data ? data.map(item => item.id === id ? updater(item) : item) : null);

    try {
      await apiCall();
    } catch {
      setData(previous);
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [data, setData, setPendingIds]);

  const optimisticDelete = useCallback(async (id: string, apiCall: () => Promise<unknown>) => {
    const previous = data ? [...data] : [];
    setPendingIds(prev => new Set([...prev, id]));
    setData(data ? data.filter(item => item.id !== id) : null);

    try {
      await apiCall();
    } catch {
      setData(previous);
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [data, setData, setPendingIds]);

  return { optimisticCreate, optimisticUpdate, optimisticDelete };
}
