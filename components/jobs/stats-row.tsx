'use client';

import { JobApplication } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface StatsRowProps {
  jobs: JobApplication[];
}

export function StatsRow({ jobs }: StatsRowProps) {
  const total = jobs.length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const offers = jobs.filter(j => j.status === 'Offer').length;
  const active = jobs.filter(j => j.status === 'Applied' || j.status === 'Interviewing').length;
  const conversionRate = total > 0 ? Math.round((interviewing / total) * 100) : 0;

  const stats = [
    { label: 'Total Applied', value: total },
    { label: 'Interviewing', value: interviewing },
    { label: 'Offers', value: offers },
    { label: 'Active', value: active },
    { label: 'Interview Rate', value: `${conversionRate}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
