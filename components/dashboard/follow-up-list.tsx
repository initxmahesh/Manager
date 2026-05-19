'use client';

import { JobApplication } from '@/lib/types';
import { isOverdue } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addDays, format, parseISO } from 'date-fns';

interface FollowUpListProps {
  jobs: JobApplication[] | null;
}

export function FollowUpList({ jobs }: FollowUpListProps) {
  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcoming = jobs
    ?.filter(j => {
      if (!j.follow_up_date) return false;
      try {
        const date = parseISO(j.follow_up_date);
        return date <= nextWeek;
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.follow_up_date.localeCompare(b.follow_up_date)) || [];

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No upcoming follow-ups.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.map((job) => (
          <div key={job.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{job.company}</p>
              <p className="text-xs text-muted-foreground">{job.role}</p>
            </div>
            <Badge variant={isOverdue(job.follow_up_date) ? 'destructive' : 'secondary'}>
              {format(parseISO(job.follow_up_date), 'MMM d')}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
