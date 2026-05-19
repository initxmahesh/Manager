'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useJobs } from '@/hooks/useJobs';
import { useWeekly } from '@/hooks/useWeekly';
import { useLoksewa } from '@/hooks/useLoksewa';
import { StatsBar } from '@/components/dashboard/stats-bar';
import { TodayTimeline } from '@/components/dashboard/today-timeline';
import { QuickAddFab } from '@/components/dashboard/quick-add-fab';
import { WeeklySidebar } from '@/components/dashboard/weekly-sidebar';
import { FollowUpList } from '@/components/dashboard/follow-up-list';
import { StreakHeatmap } from '@/components/dashboard/streak-heatmap';
import { DailyIntention } from '@/components/dashboard/daily-intention';
import { ExamCountdown } from '@/components/dashboard/exam-countdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTaskForm } from '@/components/schedule/add-task-form';
import { AddEntryForm } from '@/components/loksewa/add-entry-form';
import { AddJobForm } from '@/components/jobs/add-job-form';

export default function DashboardPage() {
  const { tasks, loading: tasksLoading, updateTask, createTask } = useTasks();
  const { jobs, loading: jobsLoading, createJob } = useJobs();
  const { goals, loading: weeklyLoading } = useWeekly();
  const { entries: loksewa, loading: loksewaLoading, createEntry } = useLoksewa();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showLoksewaForm, setShowLoksewaForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  const loading = tasksLoading || jobsLoading || weeklyLoading || loksewaLoading;

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask(id, { completed });
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <StatsBar tasks={tasks} jobs={jobs} loksewa={loksewa} loading={loading} />

      {/* Intention + Countdown Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <DailyIntention />
        <ExamCountdown />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <TodayTimeline
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={() => setShowTaskForm(true)}
              />
            </CardContent>
          </Card>

          {/* Streak Heatmap */}
          <StreakHeatmap />
        </div>

        <div className="space-y-4">
          <WeeklySidebar goals={goals} />
          <FollowUpList jobs={jobs} />
        </div>
      </div>

      <QuickAddFab
        onAddTask={() => setShowTaskForm(true)}
        onAddLoksewa={() => setShowLoksewaForm(true)}
        onAddJob={() => setShowJobForm(true)}
      />

      <AddTaskForm
        open={showTaskForm}
        onOpenChange={setShowTaskForm}
        onSubmit={createTask}
      />
      <AddEntryForm
        open={showLoksewaForm}
        onOpenChange={setShowLoksewaForm}
        onSubmit={createEntry}
      />
      <AddJobForm
        open={showJobForm}
        onOpenChange={setShowJobForm}
        onSubmit={createJob}
      />
    </div>
  );
}
