/**
 * Loksewa Tracker v2 — Complete type system
 */

export type TopicStatus = 'not_started' | 'in_progress' | 'weak' | 'mastered';
export type SessionType = 'deep_study' | 'mcq_practice' | 'revision' | 'past_paper';
export type WeakPriority = 'high' | 'medium' | 'low';
export type WeakStatus = 'needs_review' | 'reviewed' | 'mastered';

export interface LoksewaSubjectConfig {
  id: string;
  name: string;
  color: string;
  targetScore: number;
}

export interface LoksewaTopic {
  id: string;
  subject_id: string;
  topic_name: string;
  status: TopicStatus;
  times_wrong: number;
  last_studied: string;
  notes: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject_id: string;
  topic: string;
  session_type: SessionType;
  time_spent_min: number;
  confidence: number; // 1-5
  questions_attempted: number;
  questions_correct: number;
  score_percent: number;
  weak_topics: string;
  notes: string;
}

export interface WeakTopic {
  id: string;
  topic_name: string;
  subject_id: string;
  times_wrong: number;
  priority: WeakPriority;
  status: WeakStatus;
  date_added: string;
  notes: string;
}

// Default subjects for NTC Officer Level 7
export const DEFAULT_SUBJECTS: LoksewaSubjectConfig[] = [
  { id: 'networking', name: 'Networking & Communication', color: '#378ADD', targetScore: 75 },
  { id: 'electronics', name: 'Electronics & Signals', color: '#E8A838', targetScore: 75 },
  { id: 'constitution', name: 'Nepal Constitution & Law', color: '#D95F5F', targetScore: 75 },
  { id: 'gk', name: 'General Knowledge & Nepal', color: '#1D9E75', targetScore: 75 },
  { id: 'telecom', name: 'Telecom Policy & NTC', color: '#9B59B6', targetScore: 75 },
  { id: 'management', name: 'Management & Admin', color: '#E67E22', targetScore: 75 },
];

export const SESSION_TYPE_LABELS: Record<SessionType, { label: string; emoji: string }> = {
  deep_study: { label: 'Deep Study', emoji: '📖' },
  mcq_practice: { label: 'MCQ Practice', emoji: '✍️' },
  revision: { label: 'Revision', emoji: '🔄' },
  past_paper: { label: 'Past Paper', emoji: '📋' },
};

export const CONFIDENCE_EMOJIS = ['😟', '😕', '😐', '🙂', '😃'];

export const TOPIC_STATUS_CONFIG: Record<TopicStatus, { label: string; emoji: string; color: string }> = {
  not_started: { label: 'Not Started', emoji: '⭕', color: '#9CA3AF' },
  in_progress: { label: 'In Progress', emoji: '🔄', color: '#3B82F6' },
  weak: { label: 'Weak', emoji: '⚠️', color: '#EF4444' },
  mastered: { label: 'Mastered', emoji: '✅', color: '#10B981' },
};
