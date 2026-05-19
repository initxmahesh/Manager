'use client';

import { useState } from 'react';
import { LoksewaSubjectConfig, LoksewaTopic, StudySession, TOPIC_STATUS_CONFIG, TopicStatus } from '@/lib/loksewa-types';
import { differenceInDays, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectCardV2Props {
  subject: LoksewaSubjectConfig;
  topics: LoksewaTopic[];
  sessions: StudySession[];
  onTopicStatusChange: (topicId: string, status: TopicStatus) => void;
  onAddTopic: (subjectId: string, name: string) => void;
  onStudyNow: (subjectId: string) => void;
}

export function SubjectCardV2({ subject, topics, sessions, onTopicStatusChange, onAddTopic, onStudyNow }: SubjectCardV2Props) {
  const [expanded, setExpanded] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const subjectTopics = topics.filter(t => t.subject_id === subject.id);
  const subjectSessions = sessions.filter(s => s.subject_id === subject.id);

  // Mastery
  const masteredCount = subjectTopics.filter(t => t.status === 'mastered').length;
  const masteryPercent = subjectTopics.length > 0 ? Math.round((masteredCount / subjectTopics.length) * 100) : 0;

  // Mock scores
  const mockSessions = subjectSessions.filter(s => s.questions_attempted > 0);
  const avgScore = mockSessions.length > 0
    ? Math.round(mockSessions.reduce((s, m) => s + m.score_percent, 0) / mockSessions.length)
    : 0;
  const bestScore = mockSessions.length > 0
    ? Math.max(...mockSessions.map(m => m.score_percent))
    : 0;

  // Last studied
  const lastSession = subjectSessions.sort((a, b) => b.date.localeCompare(a.date))[0];
  const daysSinceLast = lastSession ? differenceInDays(new Date(), parseISO(lastSession.date)) : null;

  // Study streak for this subject
  let subStreak = 0;
  const sessionDates = [...new Set(subjectSessions.map(s => s.date))].sort().reverse();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (sessionDates.includes(dateStr)) subStreak++;
    else if (i === 0) continue;
    else break;
  }

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      onAddTopic(subject.id, newTopic.trim());
      setNewTopic('');
      setShowAdd(false);
    }
  };

  return (
    <div
      className="rounded-xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ borderColor: `${subject.color}30` }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 cursor-pointer"
        style={{ backgroundColor: `${subject.color}08` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
            <div className="min-w-0">
              <h4 className="text-sm font-bold truncate">{subject.name}</h4>
              <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                <span>{subjectTopics.length} topics</span>
                <span>•</span>
                <span>Avg: {avgScore}%</span>
                {daysSinceLast !== null && (
                  <>
                    <span>•</span>
                    <span className={daysSinceLast >= 3 ? 'text-red-500 font-medium' : ''}>
                      {daysSinceLast === 0 ? 'Today' : `${daysSinceLast}d ago`}
                      {daysSinceLast >= 3 && ' ⚠️'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {subStreak > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                🔥{subStreak}
              </span>
            )}
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>

        {/* Mastery bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${masteryPercent}%`, backgroundColor: subject.color }}
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: subject.color }}>
            {masteryPercent}%
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-3 border-t" style={{ borderColor: `${subject.color}15` }}>
          {/* Stats row */}
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <span>📊 Best: {bestScore}%</span>
            <span>📚 {subjectSessions.length} sessions</span>
            <span>⏱️ {Math.round(subjectSessions.reduce((s, sess) => s + sess.time_spent_min, 0) / 60)}h total</span>
          </div>

          {/* Topics list */}
          <div className="space-y-1.5 mb-3">
            {subjectTopics.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">No topics added yet</p>
            ) : (
              subjectTopics.map(topic => (
                <div key={topic.id} className="flex items-center gap-2 py-1 group">
                  <button
                    onClick={() => {
                      const statuses: TopicStatus[] = ['not_started', 'in_progress', 'weak', 'mastered'];
                      const currentIdx = statuses.indexOf(topic.status);
                      const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                      onTopicStatusChange(topic.id, nextStatus);
                    }}
                    className="text-sm shrink-0 hover:scale-110 transition-transform"
                    title={`Click to change status (${TOPIC_STATUS_CONFIG[topic.status].label})`}
                  >
                    {TOPIC_STATUS_CONFIG[topic.status].emoji}
                  </button>
                  <span className={cn(
                    'text-sm flex-1 truncate',
                    topic.status === 'mastered' && 'text-muted-foreground line-through',
                    topic.status === 'weak' && 'text-red-600 dark:text-red-400 font-medium',
                  )}>
                    {topic.topic_name}
                  </span>
                  {topic.times_wrong > 0 && (
                    <span className="text-[10px] text-red-500 font-medium">×{topic.times_wrong}</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add topic */}
          {showAdd ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                placeholder="Topic name..."
                className="flex-1 px-3 py-1.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
              <button onClick={handleAddTopic} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: subject.color }}>
                Add
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Topic
              </button>
              <button
                onClick={() => onStudyNow(subject.id)}
                className="flex items-center gap-1 text-xs font-semibold ml-auto px-3 py-1 rounded-lg transition-colors"
                style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
              >
                📖 Study Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
