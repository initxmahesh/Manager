import { TaskCategory, LoksewaSubject, JobStatus, JobPlatform, JobLocation } from './types';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  loksewa: '#1D9E75',
  software: '#378ADD',
  life: '#6B7280',
  review: '#7C3AED',
} as const;

export const LOKSEWA_SUBJECTS: LoksewaSubject[] = [
  'Networking',
  'Constitution & Law',
  'GK',
  'Electronics',
  'Telecom Systems',
  'Management',
];

export const JOB_STATUSES: JobStatus[] = [
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
  'Ghosted',
];

export const JOB_PLATFORMS: JobPlatform[] = [
  'LinkedIn',
  'Merojob',
  'Direct',
  'Other',
];

export const JOB_LOCATIONS: JobLocation[] = ['Nepal', 'Remote'];

export const TIME_SLOTS = [
  '05:00-06:00',
  '06:00-07:00',
  '07:00-08:00',
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00',
  '20:00-21:00',
  '21:00-22:00',
  '22:00-23:00',
];

export const SHEET_NAMES = {
  DAILY_TASKS: 'daily_tasks',
  LOKSEWA_TRACKER: 'loksewa_tracker',
  LOKSEWA_TOPICS: 'loksewa_topics',
  JOB_APPLICATIONS: 'job_applications',
  WEEKLY_GOALS: 'weekly_goals',
  SCHEDULE_TRACKING: 'schedule_tracking',
} as const;
