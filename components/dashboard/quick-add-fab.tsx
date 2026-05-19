'use client';

import { useState } from 'react';
import { Plus, Calendar, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAddFabProps {
  onAddTask: () => void;
  onAddLoksewa: () => void;
  onAddJob: () => void;
}

export function QuickAddFab({ onAddTask, onAddLoksewa, onAddJob }: QuickAddFabProps) {
  const [open, setOpen] = useState(false);

  const items = [
    { label: 'Task', icon: Calendar, onClick: onAddTask, color: 'bg-blue-500' },
    { label: 'Loksewa', icon: BookOpen, onClick: onAddLoksewa, color: 'bg-green-500' },
    { label: 'Job', icon: Briefcase, onClick: onAddJob, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex flex-col gap-2">
          {items.map((item) => (
            <Button
              key={item.label}
              size="sm"
              className={cn('shadow-lg', item.color, 'text-white hover:opacity-90')}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label="Quick add"
      >
        <Plus className={cn('h-5 w-5 transition-transform', open && 'rotate-45')} />
      </Button>
    </div>
  );
}
