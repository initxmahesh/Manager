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
import { Checkbox } from '@/components/ui/checkbox';
import { LOKSEWA_SUBJECTS } from '@/lib/constants';
import { LoksewaEntry } from '@/lib/types';
import { getTodayString } from '@/lib/utils';

const formSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  subject: z.enum(['Networking', 'Constitution & Law', 'GK', 'Electronics', 'Telecom Systems', 'Management']),
  topic: z.string(),
  questions_attempted: z.number().int().min(1, 'Must attempt at least 1 question'),
  questions_correct: z.number().int().min(0),
  mock_exam: z.boolean(),
  weak_areas: z.string(),
  notes: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface AddEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Omit<LoksewaEntry, 'id' | 'score_percent'>) => Promise<void>;
}

export function AddEntryForm({ open, onOpenChange, onSubmit }: AddEntryFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: getTodayString(),
      subject: 'Networking',
      topic: '',
      questions_attempted: 10,
      questions_correct: 0,
      mock_exam: false,
      weak_areas: '',
      notes: '',
    },
  });

  const attempted = watch('questions_attempted');
  const correct = watch('questions_correct');
  const scorePreview = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Loksewa Entry</DialogTitle>
          <DialogDescription>Log a study session or mock exam result.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
            </div>
            <div>
              <Label>Subject</Label>
              <Select onValueChange={(v) => setValue('subject', v as FormData['subject'])} defaultValue="Networking">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOKSEWA_SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" {...register('topic')} placeholder="e.g., OSI Model" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="questions_attempted">Attempted</Label>
              <Input
                id="questions_attempted"
                type="number"
                {...register('questions_attempted', { valueAsNumber: true })}
              />
              {errors.questions_attempted && (
                <p className="mt-1 text-xs text-destructive">{errors.questions_attempted.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="questions_correct">Correct</Label>
              <Input
                id="questions_correct"
                type="number"
                {...register('questions_correct', { valueAsNumber: true })}
              />
              {errors.questions_correct && (
                <p className="mt-1 text-xs text-destructive">{errors.questions_correct.message}</p>
              )}
            </div>
            <div>
              <Label>Score</Label>
              <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm font-medium">
                {scorePreview}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="mock_exam"
              onCheckedChange={(checked) => setValue('mock_exam', checked as boolean)}
            />
            <Label htmlFor="mock_exam" className="text-sm">This is a mock exam</Label>
          </div>

          <div>
            <Label htmlFor="weak_areas">Weak Areas</Label>
            <Input id="weak_areas" {...register('weak_areas')} placeholder="e.g., Subnetting, IP addressing" />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Optional notes..." />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
