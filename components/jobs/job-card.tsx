'use client';

import { useDraggable } from '@dnd-kit/core';
import { JobApplication } from '@/lib/types';
import { isOverdue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';

interface JobCardProps {
  job: JobApplication;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: job,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-sm">{job.company}</p>
              <p className="text-xs text-muted-foreground">{job.role}</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">{job.platform}</Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {job.date_applied}
            </span>
          </div>

          {job.salary_offered && (
            <p className="text-xs font-medium text-green-600 dark:text-green-400">{job.salary_offered}</p>
          )}

          {job.follow_up_date && (
            <p className={`text-xs ${isOverdue(job.follow_up_date) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              Follow-up: {job.follow_up_date}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
