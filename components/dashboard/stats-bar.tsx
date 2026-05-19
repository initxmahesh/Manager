'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DailyTask, JobApplication, LoksewaEntry } from '@/lib/types';
import { calculateStreak, getTodayString } from '@/lib/utils';
import { CheckCircle2, Target, BookOpen, Briefcase, TrendingUp, Flame } from 'lucide-react';
import { StatSkeleton } from '@/components/shared/loading-skeleton';

interface StatsBarProps {
  tasks: DailyTask[] | null;
  jobs: JobApplication[] | null;
  loksewa: LoksewaEntry[] | null;
  loading: boolean;
}

export function StatsBar({ tasks, jobs, loksewa, loading }: StatsBarProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  const today = getTodayString();
  const todayTasks = tasks?.filter(t => t.date === today) || [];
  const completedToday = todayTasks.filter(t => t.completed).length;
  const completionPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Mock avg score (last 7 days)
  const recentMocks = loksewa?.filter(e => e.mock_exam).slice(-7) || [];
  const mockAvg = recentMocks.length > 0
    ? Math.round(recentMocks.reduce((sum, e) => sum + e.score_percent, 0) / recentMocks.length)
    : 0;

  const totalJobsApplied = jobs?.length || 0;
  const activeApplications = jobs?.filter(j => j.status === 'Applied' || j.status === 'Interviewing').length || 0;
  const streak = calculateStreak(tasks || []);

  const stats = [
    { label: 'Tasks Today', value: `${completedToday}/${todayTasks.length}`, icon: CheckCircle2 },
    { label: 'Completion', value: `${completionPercent}%`, icon: Target },
    { label: 'Mock Avg', value: `${mockAvg}%`, icon: BookOpen },
    { label: 'Jobs Applied', value: totalJobsApplied, icon: Briefcase },
    { label: 'Active', value: activeApplications, icon: TrendingUp },
    { label: 'Streak', value: `${streak}d`, icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
