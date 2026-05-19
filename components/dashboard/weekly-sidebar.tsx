'use client';

import { WeeklyGoal } from '@/lib/types';
import { getCurrentWeekStart } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WeeklySidebarProps {
  goals: WeeklyGoal[] | null;
}

export function WeeklySidebar({ goals }: WeeklySidebarProps) {
  const currentWeekStart = getCurrentWeekStart();
  const currentGoal = goals?.find(g => g.week_start_date === currentWeekStart);

  if (!currentGoal) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No goals set for this week.</p>
        </CardContent>
      </Card>
    );
  }

  const jobsProgress = currentGoal.goal_jobs_target > 0
    ? Math.min(100, Math.round((currentGoal.jobs_applied / currentGoal.goal_jobs_target) * 100))
    : 0;

  const loksewaProgress = Math.min(100, currentGoal.loksewa_mock_score);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentGoal.goal_loksewa && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Loksewa</span>
              <span className="font-medium">{loksewaProgress}%</span>
            </div>
            <Progress value={loksewaProgress} className="h-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">{currentGoal.goal_loksewa}</p>
          </div>
        )}

        {currentGoal.goal_software && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Software</span>
            </div>
            <p className="text-xs text-muted-foreground">{currentGoal.goal_software}</p>
          </div>
        )}

        {currentGoal.goal_jobs_target > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Jobs Target</span>
              <span className="font-medium">{currentGoal.jobs_applied}/{currentGoal.goal_jobs_target}</span>
            </div>
            <Progress value={jobsProgress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
