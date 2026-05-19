'use client';

import { useDroppable } from '@dnd-kit/core';
import { JobApplication, JobStatus } from '@/lib/types';
import { JobCard } from './job-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: JobApplication[];
  onCardClick: (job: JobApplication) => void;
}

export function KanbanColumn({ status, jobs, onCardClick }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[200px] w-64 flex-shrink-0 flex-col rounded-lg border bg-muted/30 p-3 transition-colors md:w-full',
        isOver && 'bg-accent/50 border-primary/50'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{status}</h3>
        <Badge variant="secondary" className="text-xs">{jobs.length}</Badge>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => onCardClick(job)} />
        ))}
      </div>
    </div>
  );
}
