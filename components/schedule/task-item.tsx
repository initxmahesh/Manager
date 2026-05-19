'use client';

import { useState } from 'react';
import { DailyTask } from '@/lib/types';
import { getCategoryColor, cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Check, X } from 'lucide-react';

interface TaskItemProps {
  task: DailyTask;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, updates: Partial<DailyTask>) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(task.task_name);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(task.id, { task_name: editName.trim() });
    }
    setEditing(false);
  };

  return (
    <div
      className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
      style={{ borderLeftColor: getCategoryColor(task.category), borderLeftWidth: '3px' }}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
      />

      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-7 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <>
          <span className={cn('flex-1 text-sm', task.completed && 'text-muted-foreground line-through')}>
            {task.task_name}
          </span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
