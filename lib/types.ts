export type TaskCategory = 'loksewa' | 'software' | 'life' | 'review';
export type DayType = 'weekday' | 'saturday' | 'sunday';
export type JobLocation = 'Nepal' | 'Remote';
export type JobPlatform = 'LinkedIn' | 'Merojob' | 'Direct' | 'Other';
export type JobStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Ghosted';
export type LoksewaSubject = 'Networking' | 'Constitution & Law' | 'GK' | 'Electronics' | 'Telecom Systems' | 'Management';

export interface DailyTask {
  id: string;
  date: string;
  time_slot: string;
  task_name: string;
  category: TaskCategory;
  day_type: DayType;
  completed: boolean;
  notes: string;
}

export interface LoksewaEntry {
  id: string;
  date: string;
  subject: LoksewaSubject;
  topic: string;
  questions_attempted: number;
  questions_correct: number;
  score_percent: number;
  mock_exam: boolean;
  weak_areas: string;
  notes: string;
}

export interface JobApplication {
  id: string;
  date_applied: string;
  company: string;
  role: string;
  location: JobLocation;
  platform: JobPlatform;
  status: JobStatus;
  salary_offered: string;
  follow_up_date: string;
  notes: string;
  link: string;
}

export interface WeeklyGoal {
  id: string;
  week_start_date: string;
  goal_loksewa: string;
  goal_software: string;
  goal_jobs_target: number;
  jobs_applied: number;
  loksewa_mock_score: number;
  notes: string;
  completed: boolean;
}
