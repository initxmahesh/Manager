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
import { JOB_STATUSES, JOB_PLATFORMS, JOB_LOCATIONS } from '@/lib/constants';
import { JobApplication } from '@/lib/types';
import { getTodayString } from '@/lib/utils';

const formSchema = z.object({
  date_applied: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.enum(['Nepal', 'Remote']),
  platform: z.enum(['LinkedIn', 'Merojob', 'Direct', 'Other']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted']),
  salary_offered: z.string(),
  follow_up_date: z.string(),
  notes: z.string(),
  link: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface AddJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Omit<JobApplication, 'id'>) => Promise<void>;
}

export function AddJobForm({ open, onOpenChange, onSubmit }: AddJobFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_applied: getTodayString(),
      company: '',
      role: '',
      location: 'Nepal',
      platform: 'LinkedIn',
      status: 'Applied',
      salary_offered: '',
      follow_up_date: '',
      notes: '',
      link: '',
    },
  });

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new job application.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register('company')} placeholder="e.g., F1Soft" />
              {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" {...register('role')} placeholder="e.g., Backend Developer" />
              {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_applied">Date Applied</Label>
              <Input id="date_applied" type="date" {...register('date_applied')} />
            </div>
            <div>
              <Label>Location</Label>
              <Select onValueChange={(v) => setValue('location', v as FormData['location'])} defaultValue="Nepal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select onValueChange={(v) => setValue('platform', v as FormData['platform'])} defaultValue="LinkedIn">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select onValueChange={(v) => setValue('status', v as FormData['status'])} defaultValue="Applied">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_offered">Salary</Label>
              <Input id="salary_offered" {...register('salary_offered')} placeholder="e.g., 80k NPR" />
            </div>
            <div>
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input id="follow_up_date" type="date" {...register('follow_up_date')} />
            </div>
          </div>

          <div>
            <Label htmlFor="link">Link</Label>
            <Input id="link" {...register('link')} placeholder="https://..." />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Optional notes..." />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
