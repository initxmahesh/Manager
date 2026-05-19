import { z } from 'zod';

export const taskSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time_slot: z.string().min(1, 'Time slot is required'),
  task_name: z.string().min(1, 'Task name is required'),
  category: z.enum(['loksewa', 'software', 'life', 'review'], {
    message: 'Category must be one of: loksewa, software, life, review',
  }),
  day_type: z.enum(['weekday', 'saturday', 'sunday'], {
    message: 'Day type must be one of: weekday, saturday, sunday',
  }),
  completed: z.boolean().default(false),
  notes: z.string().default(''),
});

export const taskUpdateSchema = taskSchema.partial();

export const loksewaSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  subject: z.enum(['Networking', 'Constitution & Law', 'GK', 'Electronics', 'Telecom Systems', 'Management'], {
    message: 'Subject must be one of: Networking, Constitution & Law, GK, Electronics, Telecom Systems, Management',
  }),
  topic: z.string().default(''),
  questions_attempted: z.number().int().min(1, 'Must attempt at least 1 question'),
  questions_correct: z.number().int().min(0, 'Correct answers cannot be negative'),
  mock_exam: z.boolean().default(false),
  weak_areas: z.string().default(''),
  notes: z.string().default(''),
}).refine(data => data.questions_correct <= data.questions_attempted, {
  message: 'Correct answers cannot exceed attempted questions',
  path: ['questions_correct'],
});

export const loksewaUpdateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  subject: z.enum(['Networking', 'Constitution & Law', 'GK', 'Electronics', 'Telecom Systems', 'Management']).optional(),
  topic: z.string().optional(),
  questions_attempted: z.number().int().min(1).optional(),
  questions_correct: z.number().int().min(0).optional(),
  mock_exam: z.boolean().optional(),
  weak_areas: z.string().optional(),
  notes: z.string().optional(),
});

export const jobSchema = z.object({
  date_applied: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.enum(['Nepal', 'Remote'], {
    message: 'Location must be Nepal or Remote',
  }),
  platform: z.enum(['LinkedIn', 'Merojob', 'Direct', 'Other'], {
    message: 'Platform must be one of: LinkedIn, Merojob, Direct, Other',
  }),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'], {
    message: 'Status must be one of: Applied, Interviewing, Offer, Rejected, Ghosted',
  }),
  salary_offered: z.string().default(''),
  follow_up_date: z.string().default(''),
  notes: z.string().default(''),
  link: z.string().default(''),
});

export const jobUpdateSchema = jobSchema.partial();

export const weeklySchema = z.object({
  week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  goal_loksewa: z.string().default(''),
  goal_software: z.string().default(''),
  goal_jobs_target: z.number().int().min(0).default(0),
  jobs_applied: z.number().int().min(0).default(0),
  loksewa_mock_score: z.number().min(0).max(100).default(0),
  notes: z.string().default(''),
  completed: z.boolean().default(false),
});

export const weeklyUpdateSchema = weeklySchema.partial();
