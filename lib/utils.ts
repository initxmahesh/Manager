import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, isBefore, parseISO, differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns';
import { CATEGORY_COLORS } from './constants';
import { DailyTask, TaskCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: TaskCategory): string {
  return CATEGORY_COLORS[category];
}

export function calculateStreak(tasks: DailyTask[]): number {
  if (!tasks.length) return 0;

  const completedByDate = new Map<string, boolean>();
  for (const task of tasks) {
    if (task.completed) {
      completedByDate.set(task.date, true);
    }
  }

  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);

  // Check if today has completed tasks, if not start from yesterday
  const todayStr = format(today, 'yyyy-MM-dd');
  if (!completedByDate.has(todayStr)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    if (completedByDate.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getCurrentWeekStart(): string {
  const now = new Date();
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
}

export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  } catch {
    return false;
  }
}

export function formatRelativeSync(date: Date | null): string {
  if (!date) return 'Never';
  const now = new Date();
  const seconds = differenceInSeconds(now, date);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = differenceInMinutes(now, date);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = differenceInHours(now, date);
  return `${hours}h ago`;
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDayType(): 'weekday' | 'saturday' | 'sunday' {
  const day = new Date().getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekday';
}
