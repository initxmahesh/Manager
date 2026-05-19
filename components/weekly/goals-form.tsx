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
import { WeeklyGoal } from '@/lib/types';
import { getCurrentWeekStart } from '@/lib/utils';

const formSchema = z.object({
  week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  goal_loksewa: z.string(),
  goal_software: z.string(),
  goal_jobs_target: z.number().int().min(0),
  jobs_applied: z.number().int().min(0),
  loksewa_mock_score: z.number().min(0).max(100),
  notes: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface GoalsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Omit<WeeklyGoal, 'id'>) => Promise<void>;
  editGoal?: WeeklyGoal | null;
  onUpdate?: (id: string, updates: Partial<WeeklyGoal>) => Promise<void>;
}

export function GoalsForm({ open, onOpenChange, onSubmit, editGoal, onUpdate }: GoalsFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editGoal ? {
      week_start_date: editGoal.week_start_date,
      goal_loksewa: editGoal.goal_loksewa,
      goal_software: editGoal.goal_software,
      goal_jobs_target: editGoal.goal_jobs_target,
      jobs_applied: editGoal.jobs_applied,
      loksewa_mock_score: editGoal.loksewa_mock_score,
      notes: editGoal.notes,
    } : {
      week_start_date: getCurrentWeekStart(),
      goal_loksewa: '',
      goal_software: '',
      goal_jobs_target: 5,
      jobs_applied: 0,
      loksewa_mock_score: 0,
      notes: '',
    },
  });

  const onFormSubmit = async (data: FormData) => {
    if (editGoal && onUpdate) {
      await onUpdate(editGoal.id, data);
    } else {
      await onSubmit({ ...data, completed: false });
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editGoal ? 'Edit Weekly Goals' : 'Set Weekly Goals'}</DialogTitle>
          <DialogDescription>Define your targets for the week.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="week_start_date">Week Start (Monday)</Label>
            <Input id="week_start_date" type="date" {...register('week_start_date')} />
            {errors.week_start_date && <p className="mt-1 text-xs text-destructive">{errors.week_start_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="goal_loksewa">Loksewa Goal</Label>
            <Input id="goal_loksewa" {...register('goal_loksewa')} placeholder="e.g., Complete 3 mock exams" />
          </div>

          <div>
            <Label htmlFor="goal_software">Software Goal</Label>
            <Input id="goal_software" {...register('goal_software')} placeholder="e.g., Build REST API project" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goal_jobs_target">Jobs Target</Label>
              <Input id="goal_jobs_target" type="number" {...register('goal_jobs_target', { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="jobs_applied">Jobs Applied</Label>
              <Input id="jobs_applied" type="number" {...register('jobs_applied', { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="loksewa_mock_score">Mock Score %</Label>
              <Input id="loksewa_mock_score" type="number" {...register('loksewa_mock_score', { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Optional notes..." />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editGoal ? 'Update Goals' : 'Set Goals'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
