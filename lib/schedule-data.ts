/**
 * Predefined schedule blocks for each day type.
 * These represent the fixed daily routine — not dynamic events.
 */

export type ScheduleCategory = 'loksewa' | 'software' | 'mental' | 'life';

export interface ScheduleBlock {
  id: string;
  title: string;
  category: ScheduleCategory;
  startHour: number; // 24h format, e.g. 7.5 = 7:30 AM
  endHour: number;
  tasks: string[];
  notes?: string;
}

export type DayTabKey = 'mwf' | 'tth' | 'saturday' | 'sunday';

export const DAY_TABS: { key: DayTabKey; label: string; shortLabel: string }[] = [
  { key: 'mwf', label: 'Mon / Wed / Fri', shortLabel: 'M/W/F' },
  { key: 'tth', label: 'Tue / Thu', shortLabel: 'T/Th' },
  { key: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
  { key: 'sunday', label: 'Sunday', shortLabel: 'Sun' },
];

export const CATEGORY_META: Record<ScheduleCategory, { color: string; bgLight: string; bgDark: string; label: string }> = {
  loksewa: {
    color: '#1D9E75',
    bgLight: 'rgba(29, 158, 117, 0.08)',
    bgDark: 'rgba(29, 158, 117, 0.12)',
    label: 'Loksewa',
  },
  software: {
    color: '#378ADD',
    bgLight: 'rgba(55, 138, 221, 0.08)',
    bgDark: 'rgba(55, 138, 221, 0.12)',
    label: 'Software',
  },
  mental: {
    color: '#7F77DD',
    bgLight: 'rgba(127, 119, 221, 0.08)',
    bgDark: 'rgba(127, 119, 221, 0.12)',
    label: 'Mental Health',
  },
  life: {
    color: '#888780',
    bgLight: 'rgba(136, 135, 128, 0.06)',
    bgDark: 'rgba(136, 135, 128, 0.10)',
    label: 'Life',
  },
};

// Timeline runs from 5 AM to 1 AM (next day) = hours 5 to 25
export const TIMELINE_START = 5;
export const TIMELINE_END = 25; // 1 AM next day
export const HOUR_HEIGHT = 72; // pixels per hour

export const SCHEDULES: Record<DayTabKey, ScheduleBlock[]> = {
  mwf: [
    {
      id: 'mwf-1',
      title: 'Morning Routine',
      category: 'life',
      startHour: 5,
      endHour: 6,
      tasks: ['Wake up & freshen up', 'Light stretching', 'Breakfast prep'],
    },
    {
      id: 'mwf-2',
      title: 'Loksewa — Technical',
      category: 'loksewa',
      startHour: 6,
      endHour: 8.5,
      tasks: ['Networking & TCP/IP', 'Fiber optics & transmission', 'Routing protocols', 'Practice MCQs', 'Review weak areas'],
    },
    {
      id: 'mwf-3',
      title: 'Break & Refresh',
      category: 'mental',
      startHour: 8.5,
      endHour: 9,
      tasks: ['Short walk', 'Tea/coffee', 'Mindful breathing'],
    },
    {
      id: 'mwf-4',
      title: 'Loksewa — GK & Law',
      category: 'loksewa',
      startHour: 9,
      endHour: 11,
      tasks: ['Constitution & governance', 'Current affairs Nepal', 'NTC-specific regulations', 'Practice questions'],
    },
    {
      id: 'mwf-5',
      title: 'Lunch & Rest',
      category: 'life',
      startHour: 11,
      endHour: 12,
      tasks: ['Lunch', 'Short rest', 'Light reading'],
    },
    {
      id: 'mwf-6',
      title: 'Software Engineering',
      category: 'software',
      startHour: 12,
      endHour: 14.5,
      tasks: ['Backend project work', 'API development', 'System design practice', 'Code review & refactoring'],
    },
    {
      id: 'mwf-7',
      title: 'Job Applications',
      category: 'software',
      startHour: 14.5,
      endHour: 16,
      tasks: ['Apply to 2-3 positions', 'Tailor resume/cover letter', 'LinkedIn networking', 'Follow up on applications'],
    },
    {
      id: 'mwf-8',
      title: 'Mental Health Break',
      category: 'mental',
      startHour: 16,
      endHour: 17,
      tasks: ['Walk outside', 'Meditation 15min', 'Journal reflection'],
    },
    {
      id: 'mwf-9',
      title: 'Loksewa — Electronics',
      category: 'loksewa',
      startHour: 17,
      endHour: 19,
      tasks: ['Digital electronics', 'Signal processing basics', 'Telecom systems', 'Mock test practice'],
    },
    {
      id: 'mwf-10',
      title: 'Dinner & Unwind',
      category: 'life',
      startHour: 19,
      endHour: 20,
      tasks: ['Dinner', 'Family time', 'Light entertainment'],
    },
    {
      id: 'mwf-11',
      title: 'Evening Review',
      category: 'loksewa',
      startHour: 20,
      endHour: 21.5,
      tasks: ['Day review & weak areas', 'Flashcard revision', 'Plan tomorrow'],
    },
    {
      id: 'mwf-12',
      title: 'Wind Down',
      category: 'mental',
      startHour: 21.5,
      endHour: 22.5,
      tasks: ['Reading (non-study)', 'Gratitude journaling', 'Sleep preparation'],
    },
  ],
  tth: [
    {
      id: 'tth-1',
      title: 'Morning Routine',
      category: 'life',
      startHour: 5,
      endHour: 6,
      tasks: ['Wake up & freshen up', 'Yoga/stretching', 'Healthy breakfast'],
    },
    {
      id: 'tth-2',
      title: 'Software — Deep Work',
      category: 'software',
      startHour: 6,
      endHour: 9,
      tasks: ['Project development', 'Algorithm practice', 'Database design', 'API implementation', 'Testing & debugging'],
    },
    {
      id: 'tth-3',
      title: 'Break',
      category: 'mental',
      startHour: 9,
      endHour: 9.5,
      tasks: ['Coffee break', 'Short walk', 'Stretch'],
    },
    {
      id: 'tth-4',
      title: 'Loksewa — Management',
      category: 'loksewa',
      startHour: 9.5,
      endHour: 11.5,
      tasks: ['Public administration', 'Management principles', 'Planning & budgeting', 'Practice MCQs'],
    },
    {
      id: 'tth-5',
      title: 'Lunch & Rest',
      category: 'life',
      startHour: 11.5,
      endHour: 12.5,
      tasks: ['Lunch', 'Power nap 20min', 'Light reading'],
    },
    {
      id: 'tth-6',
      title: 'Loksewa — Mock Exam',
      category: 'loksewa',
      startHour: 12.5,
      endHour: 15,
      tasks: ['Full mock exam (2hr)', 'Review answers', 'Note weak areas', 'Score tracking'],
    },
    {
      id: 'tth-7',
      title: 'Software — Learning',
      category: 'software',
      startHour: 15,
      endHour: 17,
      tasks: ['System design study', 'Tech blog reading', 'Open source contribution', 'Portfolio updates'],
    },
    {
      id: 'tth-8',
      title: 'Exercise & Recovery',
      category: 'mental',
      startHour: 17,
      endHour: 18,
      tasks: ['Gym / home workout', 'Cool down stretches', 'Shower'],
    },
    {
      id: 'tth-9',
      title: 'Dinner & Social',
      category: 'life',
      startHour: 18,
      endHour: 19.5,
      tasks: ['Dinner', 'Call family/friends', 'Relaxation'],
    },
    {
      id: 'tth-10',
      title: 'Evening Study — Light',
      category: 'loksewa',
      startHour: 19.5,
      endHour: 21,
      tasks: ['Revision of weak topics', 'Flashcards', 'Quick quiz practice'],
    },
    {
      id: 'tth-11',
      title: 'Wind Down',
      category: 'mental',
      startHour: 21,
      endHour: 22,
      tasks: ['Reading', 'Journaling', 'Sleep prep'],
    },
  ],
  saturday: [
    {
      id: 'sat-1',
      title: 'Sleep In & Slow Start',
      category: 'mental',
      startHour: 7,
      endHour: 8,
      tasks: ['Extra sleep', 'Gentle wake up', 'Mindful morning'],
    },
    {
      id: 'sat-2',
      title: 'Brunch & Planning',
      category: 'life',
      startHour: 8,
      endHour: 9,
      tasks: ['Brunch', 'Weekly review', 'Plan next week'],
    },
    {
      id: 'sat-3',
      title: 'Loksewa — Full Mock',
      category: 'loksewa',
      startHour: 9,
      endHour: 12,
      tasks: ['Full-length mock exam', 'Timed conditions', 'All subjects covered', 'Detailed review after'],
    },
    {
      id: 'sat-4',
      title: 'Lunch Break',
      category: 'life',
      startHour: 12,
      endHour: 13,
      tasks: ['Lunch', 'Rest', 'Short walk'],
    },
    {
      id: 'sat-5',
      title: 'Software — Side Project',
      category: 'software',
      startHour: 13,
      endHour: 16,
      tasks: ['Personal project work', 'New technology exploration', 'Build portfolio piece', 'Write technical blog'],
    },
    {
      id: 'sat-6',
      title: 'Creative & Recovery',
      category: 'mental',
      startHour: 16,
      endHour: 18,
      tasks: ['Creative hobby', 'Nature walk', 'Music/art', 'Social activity'],
    },
    {
      id: 'sat-7',
      title: 'Evening Free',
      category: 'life',
      startHour: 18,
      endHour: 22,
      tasks: ['Dinner out / cook special', 'Movie / entertainment', 'Social time', 'Relaxation'],
    },
  ],
  sunday: [
    {
      id: 'sun-1',
      title: 'Rest & Recovery',
      category: 'mental',
      startHour: 7,
      endHour: 9,
      tasks: ['Sleep in', 'Meditation', 'Gentle yoga', 'Gratitude practice'],
    },
    {
      id: 'sun-2',
      title: 'Brunch & Reflection',
      category: 'life',
      startHour: 9,
      endHour: 10,
      tasks: ['Leisurely brunch', 'Week reflection', 'Journaling'],
    },
    {
      id: 'sun-3',
      title: 'Light Loksewa Review',
      category: 'loksewa',
      startHour: 10,
      endHour: 12,
      tasks: ['Weak area revision only', 'Flashcard review', 'Light reading — no pressure'],
    },
    {
      id: 'sun-4',
      title: 'Lunch & Nature',
      category: 'life',
      startHour: 12,
      endHour: 14,
      tasks: ['Lunch', 'Outdoor walk / hike', 'Fresh air & sunlight'],
    },
    {
      id: 'sun-5',
      title: 'Software — Exploration',
      category: 'software',
      startHour: 14,
      endHour: 16,
      tasks: ['Read tech articles', 'Watch conference talks', 'Explore new tools', 'No pressure coding'],
    },
    {
      id: 'sun-6',
      title: 'Week Preparation',
      category: 'life',
      startHour: 16,
      endHour: 17.5,
      tasks: ['Meal prep', 'Organize workspace', 'Set weekly goals', 'Prepare materials'],
    },
    {
      id: 'sun-7',
      title: 'Evening Calm',
      category: 'mental',
      startHour: 17.5,
      endHour: 19,
      tasks: ['Meditation', 'Light reading', 'Digital detox', 'Early wind down'],
    },
    {
      id: 'sun-8',
      title: 'Dinner & Early Sleep',
      category: 'life',
      startHour: 19,
      endHour: 21,
      tasks: ['Light dinner', 'Family time', 'Sleep by 9:30 PM'],
    },
  ],
};

export function formatHour(hour: number): string {
  const h = Math.floor(hour) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  if (m === 0) return `${displayH} ${period}`;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatTimeRange(start: number, end: number): string {
  return `${formatHour(start)} → ${formatHour(end)}`;
}

export function getDurationText(start: number, end: number): string {
  const diff = end - start;
  const hours = Math.floor(diff);
  const minutes = Math.round((diff - hours) * 60);
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getCurrentHourPosition(): number {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}
