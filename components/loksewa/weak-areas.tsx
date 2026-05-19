'use client';

import { LoksewaEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface WeakAreasProps {
  entries: LoksewaEntry[] | null;
}

export function WeakAreas({ entries }: WeakAreasProps) {
  const allWeakAreas = entries
    ?.flatMap(e => e.weak_areas.split(',').map(w => w.trim()).filter(Boolean))
    || [];

  const frequency = allWeakAreas.reduce((acc, area) => {
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No weak areas identified yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(([area, count]) => (
        <Badge key={area} variant="secondary">
          {area} ({count})
        </Badge>
      ))}
    </div>
  );
}
