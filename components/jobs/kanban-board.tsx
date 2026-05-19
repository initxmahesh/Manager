'use client';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { JobApplication, JobStatus } from '@/lib/types';
import { JOB_STATUSES } from '@/lib/constants';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onStatusChange: (id: string, status: JobStatus) => void;
  onCardClick: (job: JobApplication) => void;
}

export function KanbanBoard({ jobs, onStatusChange, onCardClick }: KanbanBoardProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    if (JOB_STATUSES.includes(newStatus)) {
      const job = jobs.find(j => j.id === jobId);
      if (job && job.status !== newStatus) {
        onStatusChange(jobId, newStatus);
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-x-visible">
        {JOB_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobs.filter(j => j.status === status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
