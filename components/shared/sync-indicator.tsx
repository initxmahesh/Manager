'use client';

import { formatRelativeSync } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SyncIndicatorProps {
  lastSynced: Date | null;
}

export function SyncIndicator({ lastSynced }: SyncIndicatorProps) {
  const isRecent = lastSynced && (Date.now() - lastSynced.getTime()) < 30000;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          isRecent ? 'bg-green-500' : 'bg-yellow-500'
        )}
      />
      <span>Synced {formatRelativeSync(lastSynced)}</span>
    </div>
  );
}
