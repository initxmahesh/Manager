'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JOB_STATUSES, JOB_PLATFORMS, JOB_LOCATIONS } from '@/lib/constants';
import { JobStatus, JobPlatform, JobLocation } from '@/lib/types';

interface FilterBarProps {
  statusFilter: JobStatus | 'all';
  locationFilter: JobLocation | 'all';
  platformFilter: JobPlatform | 'all';
  onStatusChange: (value: JobStatus | 'all') => void;
  onLocationChange: (value: JobLocation | 'all') => void;
  onPlatformChange: (value: JobPlatform | 'all') => void;
}

export function FilterBar({
  statusFilter,
  locationFilter,
  platformFilter,
  onStatusChange,
  onLocationChange,
  onPlatformChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as JobStatus | 'all')}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {JOB_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={locationFilter} onValueChange={(v) => onLocationChange(v as JobLocation | 'all')}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {JOB_LOCATIONS.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={platformFilter} onValueChange={(v) => onPlatformChange(v as JobPlatform | 'all')}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          {JOB_PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
