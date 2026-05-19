'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TIME_SLOTS } from '@/lib/constants';
import { DailyTask } from '@/lib/types';
import { getTodayString, getDayType } from '@/lib/utils';

const formSchema = z.object({
  task_name: z.string().min(1, 'Task name is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date required'),
  time_slot: z.string().min(1, 'Time slot is required'),
  category: z.enum(['loksewa', 'software', 'life', 'review']),
  day_type: z.enum(['weekday', 'saturday', 'sunday']),
  notes: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface AddTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<DailyTask, 'id'>) => Promise<void>;
  defaultTimeSlot?: string;
}

export function AddTaskForm({ open, onOpenChange, onSubmit, defaultTimeSlot }: AddTaskFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_name: '',
      date: getTodayString(),
      time_slot: defaultTimeSlot || '',
      category: 'software',
      day_type: getDayType(),
      notes: '',
    },
  });

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({ ...data, completed: false });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new daily task for your schedule.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="task_name">Task Name</Label>
            <Input id="task_name" {...register('task_name')} placeholder="e.g., Study Networking" />
            {errors.task_name && <p className="mt-1 text-xs text-destructive">{errors.task_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div>
              <Label>Time Slot</Label>
              <Select onValueChange={(v) => setValue('time_slot', v)} defaultValue={defaultTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time_slot && <p className="mt-1 text-xs text-destructive">{errors.time_slot.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select onValueChange={(v) => setValue('category', v as FormData['category'])} defaultValue="software">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loksewa">Loksewa</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Day Type</Label>
              <Select onValueChange={(v) => setValue('day_type', v as FormData['day_type'])} defaultValue={getDayType()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday">Weekday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Optional notes..." />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
