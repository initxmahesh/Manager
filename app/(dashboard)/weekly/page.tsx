'use client';

import { useState } from 'react';
import { useWeekly } from '@/hooks/useWeekly';
import { WeeklyGoal } from '@/lib/types';
import { CurrentWeekCard } from '@/components/weekly/current-week-card';
import { GoalsForm } from '@/components/weekly/goals-form';
import { HistoryTable } from '@/components/weekly/history-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { Plus } from 'lucide-react';

export default function WeeklyPage() {
  const { goals, loading, createGoal, updateGoal } = useWeekly();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<WeeklyGoal | null>(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const handleEdit = (goal: WeeklyGoal) => {
    setEditGoal(goal);
    setShowForm(true);
  };

  const handleMarkComplete = (id: string) => {
    updateGoal(id, { completed: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Goals</h1>
        <Button onClick={() => { setEditGoal(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Set Goals
        </Button>
      </div>

      <CurrentWeekCard
        goals={goals}
        onEdit={handleEdit}
        onMarkComplete={handleMarkComplete}
      />

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryTable goals={goals} />
        </CardContent>
      </Card>

      <GoalsForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={createGoal}
        editGoal={editGoal}
        onUpdate={updateGoal}
      />
    </div>
  );
}
