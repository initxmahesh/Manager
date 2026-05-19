'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { DailyTask, DayType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/components/schedule/task-item';
import { AddTaskForm } from '@/components/schedule/add-task-form';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAY_TABS: { label: string; value: DayType }[] = [
  { label: 'Weekday', value: 'weekday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

export default function SchedulePage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [activeTab, setActiveTab] = useState<DayType>('weekday');
  const [showForm, setShowForm] = useState(false);
  const [defaultTimeSlot, setDefaultTimeSlot] = useState<string | undefined>();

  const filteredTasks = tasks?.filter(t => t.day_type === activeTab) || [];

  // Group by time_slot
  const grouped = filteredTasks.reduce((acc, task) => {
    if (!acc[task.time_slot]) acc[task.time_slot] = [];
    acc[task.time_slot].push(task);
    return acc;
  }, {} as Record<string, DailyTask[]>);

  const sortedSlots = Object.keys(grouped).sort();

  const handleAddInSlot = (slot: string) => {
    setDefaultTimeSlot(slot);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Schedule</h1>
        <Button onClick={() => { setDefaultTimeSlot(undefined); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Day Type Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {DAY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Time Blocks */}
      {sortedSlots.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No tasks yet"
          description={`No tasks scheduled for ${activeTab} days. Add some to get started.`}
          actionLabel="Add Task"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {sortedSlots.map((slot) => (
            <Card key={slot}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{slot}</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => handleAddInSlot(slot)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {grouped[slot].map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(id, completed) => updateTask(id, { completed })}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddTaskForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={createTask}
        defaultTimeSlot={defaultTimeSlot}
      />
    </div>
  );
}
