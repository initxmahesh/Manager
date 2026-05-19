'use client';

import { WeeklyGoal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface HistoryTableProps {
  goals: WeeklyGoal[] | null;
}

export function HistoryTable({ goals }: HistoryTableProps) {
  const sorted = [...(goals || [])].sort((a, b) => b.week_start_date.localeCompare(a.week_start_date));

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left font-medium">Week</th>
            <th className="px-3 py-2 text-left font-medium">Loksewa Goal</th>
            <th className="px-3 py-2 text-left font-medium">Software Goal</th>
            <th className="px-3 py-2 text-left font-medium">Jobs</th>
            <th className="px-3 py-2 text-left font-medium">Mock Score</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((goal) => (
            <tr key={goal.id} className="border-b hover:bg-accent/50">
              <td className="px-3 py-2">{goal.week_start_date}</td>
              <td className="px-3 py-2 max-w-[150px] truncate">{goal.goal_loksewa || '—'}</td>
              <td className="px-3 py-2 max-w-[150px] truncate">{goal.goal_software || '—'}</td>
              <td className="px-3 py-2">{goal.jobs_applied}/{goal.goal_jobs_target}</td>
              <td className="px-3 py-2">{goal.loksewa_mock_score}%</td>
              <td className="px-3 py-2">
                <Badge variant={goal.completed ? 'default' : 'secondary'}>
                  {goal.completed ? 'Done' : 'In Progress'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
