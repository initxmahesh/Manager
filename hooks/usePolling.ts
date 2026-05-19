'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePollingReturn<T> {
  data: T[] | null;
  loading: boolean;
  lastSynced: Date | null;
  refetch: () => Promise<void>;
  setData: (data: T[] | null) => void;
  pendingIds: Set<string>;
  setPendingIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function usePolling<T extends { id: string }>(
  url: string,
  interval: number = 15000
): UsePollingReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const isPolling = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (isPolling.current) return;
    isPolling.current = true;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      const serverData: T[] = await response.json();

      setData(prev => {
        if (!prev) return serverData;
        // Merge: keep optimistic updates for pending items
        return serverData.map(serverItem => {
          if (pendingIds.has(serverItem.id)) {
            const localItem = prev.find(p => p.id === serverItem.id);
            return localItem || serverItem;
          }
          return serverItem;
        });
      });

      setLastSynced(new Date());
      setLoading(false);
    } catch (error) {
      console.error(`Polling error for ${url}:`, error);
      if (loading) setLoading(false);
    } finally {
      isPolling.current = false;
    }
  }, [url, pendingIds, loading]);

  const refetch = useCallback(async () => {
    isPolling.current = false;
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, interval]);

  return { data, loading, lastSynced, refetch, setData, pendingIds, setPendingIds };
}
