'use client';

import { JobApplication } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isOverdue } from '@/lib/utils';
import { ExternalLink, Trash2 } from 'lucide-react';

interface JobDetailModalProps {
  job: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export function JobDetailModal({ job, open, onOpenChange, onDelete }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job.company}</DialogTitle>
          <DialogDescription>{job.role}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="secondary">{job.status}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Platform</p>
              <p className="font-medium">{job.platform}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date Applied</p>
              <p className="font-medium">{job.date_applied}</p>
            </div>
            {job.salary_offered && (
              <div>
                <p className="text-muted-foreground">Salary</p>
                <p className="font-medium text-green-600">{job.salary_offered}</p>
              </div>
            )}
            {job.follow_up_date && (
              <div>
                <p className="text-muted-foreground">Follow-up</p>
                <p className={`font-medium ${isOverdue(job.follow_up_date) ? 'text-red-500' : ''}`}>
                  {job.follow_up_date}
                </p>
              </div>
            )}
          </div>

          {job.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{job.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            {job.link && (
              <Button variant="outline" size="sm" asChild>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Open Link
                </a>
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(job.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
