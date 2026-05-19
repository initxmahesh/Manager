'use client';

import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobApplication, JobStatus, JobPlatform, JobLocation } from '@/lib/types';
import { KanbanBoard } from '@/components/jobs/kanban-board';
import { StatsRow } from '@/components/jobs/stats-row';
import { FilterBar } from '@/components/jobs/filter-bar';
import { AddJobForm } from '@/components/jobs/add-job-form';
import { JobDetailModal } from '@/components/jobs/job-detail-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Plus, Briefcase } from 'lucide-react';

export default function JobsPage() {
  const { jobs, loading, createJob, updateJob, deleteJob } = useJobs();
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<JobLocation | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<JobPlatform | 'all'>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const filteredJobs = (jobs || []).filter(j => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (locationFilter !== 'all' && j.location !== locationFilter) return false;
    if (platformFilter !== 'all' && j.platform !== platformFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: JobStatus) => {
    updateJob(id, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      <StatsRow jobs={jobs || []} />

      <FilterBar
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        platformFilter={platformFilter}
        onStatusChange={setStatusFilter}
        onLocationChange={setLocationFilter}
        onPlatformChange={setPlatformFilter}
      />

      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job applications"
          description="Start tracking your job applications by adding one."
          actionLabel="Add Job"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <KanbanBoard
          jobs={filteredJobs}
          onStatusChange={handleStatusChange}
          onCardClick={setSelectedJob}
        />
      )}

      <AddJobForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={createJob}
      />

      <JobDetailModal
        job={selectedJob}
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
        onDelete={deleteJob}
      />
    </div>
  );
}
