'use client';

import { useState } from 'react';
import { LoksewaTopic, DEFAULT_SUBJECTS, TOPIC_STATUS_CONFIG } from '@/lib/loksewa-types';
import { cn } from '@/lib/utils';

interface WeakTopicsPanelProps {
  topics: LoksewaTopic[];
  onStatusChange: (topicId: string, status: 'needs_review' | 'reviewed' | 'mastered') => void;
}

export function WeakTopicsPanel({ topics, onStatusChange }: WeakTopicsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'weak' | 'in_progress'>('all');

  // Get weak/in-progress topics sorted by times_wrong
  const weakTopics = topics
    .filter(t => {
      if (filter === 'weak') return t.status === 'weak';
      if (filter === 'in_progress') return t.status === 'in_progress';
      return t.status === 'weak' || t.status === 'in_progress' || t.times_wrong > 0;
    })
    .sort((a, b) => b.times_wrong - a.times_wrong);

  function getPriority(timesWrong: number): { label: string; color: string; emoji: string } {
    if (timesWrong >= 3) return { label: 'High', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20', emoji: '🔴' };
    if (timesWrong >= 2) return { label: 'Med', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20', emoji: '🟡' };
    return { label: 'Low', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20', emoji: '🟢' };
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-3">
        {[
          { key: 'all' as const, label: 'All', count: topics.filter(t => t.status === 'weak' || t.status === 'in_progress' || t.times_wrong > 0).length },
          { key: 'weak' as const, label: '⚠️ Weak', count: topics.filter(t => t.status === 'weak').length },
          { key: 'in_progress' as const, label: '🔄 In Progress', count: topics.filter(t => t.status === 'in_progress').length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-medium transition-all',
              filter === f.key
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Topics list */}
      {weakTopics.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-medium mt-2">No weak topics!</p>
          <p className="text-xs text-muted-foreground mt-1">Keep practicing to identify areas to improve</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {weakTopics.map(topic => {
            const subject = DEFAULT_SUBJECTS.find(s => s.id === topic.subject_id);
            const priority = getPriority(topic.times_wrong);
            const statusConfig = TOPIC_STATUS_CONFIG[topic.status];

            return (
              <div
                key={topic.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/30 transition-colors group"
              >
                {/* Priority */}
                <span className="text-sm shrink-0">{priority.emoji}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{topic.topic_name}</span>
                    {topic.times_wrong > 0 && (
                      <span className="text-[10px] font-bold text-red-500 shrink-0">×{topic.times_wrong}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${subject?.color}15`, color: subject?.color }}
                    >
                      {subject?.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {statusConfig.emoji} {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onStatusChange(topic.id, 'mastered')}
                    className="text-[10px] px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-200 transition-colors"
                    title="Mark as mastered"
                  >
                    ✅
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
