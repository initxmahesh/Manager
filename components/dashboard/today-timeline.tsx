'use client';

import { DailyTask } from '@/lib/types';
import { getTodayString, getCategoryColor } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/shared/empty-state';
import { Calendar } from 'lucide-react';

interface TodayTimelineProps {
  tasks: DailyTask[] | null;
  onToggleTask: (id: string, completed: boolean) => void;
  onAddTask: () => void;
}

export function TodayTimeline({ tasks, onToggleTask, onAddTask }: TodayTimelineProps) {
  const today = getTodayString();
  const todayTasks = tasks?.filter(t => t.date === today) || [];

  if (todayTasks.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No tasks for today"
        description="Start planning your day by adding some tasks."
        actionLabel="Add Task"
        onAction={onAddTask}
      />
    );
  }

  // Group by time_slot
  const grouped = todayTasks.reduce((acc, task) => {
    if (!acc[task.time_slot]) acc[task.time_slot] = [];
    acc[task.time_slot].push(task);
    return acc;
  }, {} as Record<string, DailyTask[]>);

  const sortedSlots = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {sortedSlots.map((slot) => (
        <div key={slot} className="relative pl-6">
          <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
          {sortedSlots.indexOf(slot) < sortedSlots.length - 1 && (
            <div className="absolute left-[5px] top-4 h-full w-0.5 bg-border" />
          )}
          <p className="mb-2 text-xs font-medium text-muted-foreground">{slot}</p>
          <div className="space-y-2">
            {grouped[slot].map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border p-3"
                style={{ borderLeftColor: getCategoryColor(task.category), borderLeftWidth: '3px' }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => onToggleTask(task.id, checked as boolean)}
                />
                <span className={task.completed ? 'text-muted-foreground line-through' : ''}>
                  {task.task_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
