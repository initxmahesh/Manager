'use client';

import { WeeklyGoal } from '@/lib/types';
import { getCurrentWeekStart } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Edit } from 'lucide-react';

interface CurrentWeekCardProps {
  goals: WeeklyGoal[] | null;
  onEdit: (goal: WeeklyGoal) => void;
  onMarkComplete: (id: string) => void;
}

export function CurrentWeekCard({ goals, onEdit, onMarkComplete }: CurrentWeekCardProps) {
  const currentWeekStart = getCurrentWeekStart();
  const currentGoal = goals?.find(g => g.week_start_date === currentWeekStart);

  if (!currentGoal) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No goals set for this week.</p>
        </CardContent>
      </Card>
    );
  }

  const jobsProgress = currentGoal.goal_jobs_target > 0
    ? Math.min(100, Math.round((currentGoal.jobs_applied / currentGoal.goal_jobs_target) * 100))
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">This Week&apos;s Goals</CardTitle>
        <div className="flex gap-2">
          {currentGoal.completed ? (
            <Badge className="bg-green-500">Completed</Badge>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => onEdit(currentGoal)}>
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" onClick={() => onMarkComplete(currentGoal.id)}>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Complete
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentGoal.goal_loksewa && (
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Loksewa</span>
              <span className="text-muted-foreground">{currentGoal.loksewa_mock_score}%</span>
            </div>
            <Progress value={currentGoal.loksewa_mock_score} />
            <p className="mt-1 text-xs text-muted-foreground">{currentGoal.goal_loksewa}</p>
          </div>
        )}

        {currentGoal.goal_software && (
          <div>
            <p className="text-sm font-medium">Software</p>
            <p className="text-sm text-muted-foreground">{currentGoal.goal_software}</p>
          </div>
        )}

        {currentGoal.goal_jobs_target > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Jobs Applied</span>
              <span className="text-muted-foreground">{currentGoal.jobs_applied}/{currentGoal.goal_jobs_target}</span>
            </div>
            <Progress value={jobsProgress} />
          </div>
        )}

        {currentGoal.notes && (
          <p className="text-xs text-muted-foreground">{currentGoal.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
