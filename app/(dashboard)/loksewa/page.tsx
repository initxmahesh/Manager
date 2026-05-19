'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_SUBJECTS, LoksewaTopic, StudySession, TopicStatus } from '@/lib/loksewa-types';
import { CommandCenter } from '@/components/loksewa/command-center';
import { SubjectCardV2 } from '@/components/loksewa/subject-card-v2';
import { ScoreTrendChartV2 } from '@/components/loksewa/score-trend-chart-v2';
import { StudyHeatmap } from '@/components/loksewa/study-heatmap';
import { WeakTopicsPanel } from '@/components/loksewa/weak-topics-panel';
import { LogSessionModal } from '@/components/loksewa/log-session-modal';
import { QuizSection } from '@/components/loksewa/quiz-section';
import { Skeleton } from '@/components/shared/loading-skeleton';

export default function LoksewaPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [topics, setTopics] = useState<LoksewaTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogSession, setShowLogSession] = useState(false);
  const [defaultSubject, setDefaultSubject] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'subjects' | 'charts' | 'quiz'>('subjects');

  useEffect(() => {
    async function load() {
      try {
        const [sessRes, topicsRes] = await Promise.all([
          fetch('/api/loksewa/sessions?days=90'),
          fetch('/api/loksewa/topics'),
        ]);
        if (sessRes.ok) setSessions(await sessRes.json());
        if (topicsRes.ok) setTopics(await topicsRes.json());
      } catch (err) {
        console.error('Failed to load loksewa data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const refreshData = useCallback(async () => {
    const [sessRes, topicsRes] = await Promise.all([
      fetch('/api/loksewa/sessions?days=90'),
      fetch('/api/loksewa/topics'),
    ]);
    if (sessRes.ok) setSessions(await sessRes.json());
    if (topicsRes.ok) setTopics(await topicsRes.json());
  }, []);

  const handleTopicStatusChange = useCallback(async (topicId: string, status: TopicStatus) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status } : t));
    try {
      await fetch(`/api/loksewa/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, last_studied: new Date().toISOString().split('T')[0] }),
      });
    } catch { /* revert handled by next poll */ }
  }, []);

  const handleWeakTopicStatusChange = useCallback(async (topicId: string, status: string) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: status as TopicStatus } : t));
    try {
      await fetch(`/api/loksewa/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch { /* ignore */ }
  }, []);

  const handleAddTopic = useCallback(async (subjectId: string, name: string) => {
    try {
      const res = await fetch('/api/loksewa/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_id: subjectId, topic_name: name }),
      });
      if (res.ok) {
        const newTopic = await res.json();
        setTopics(prev => [...prev, newTopic]);
      }
    } catch { /* ignore */ }
  }, []);

  const handleStudyNow = (subjectId: string) => {
    setDefaultSubject(subjectId);
    setShowLogSession(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Command Center */}
      <CommandCenter
        sessions={sessions}
        topics={topics}
        onLogSession={() => { setDefaultSubject(''); setShowLogSession(true); }}
        onLogMock={() => { setDefaultSubject(''); setShowLogSession(true); }}
      />

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { key: 'subjects' as const, label: '📚 Subjects', mobileLabel: '📚' },
          { key: 'charts' as const, label: '📊 Progress', mobileLabel: '📊' },
          { key: 'quiz' as const, label: '🧠 Quiz', mobileLabel: '🧠' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeSection === tab.key
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.mobileLabel} {tab.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* ─── SUBJECTS SECTION ─── */}
      {activeSection === 'subjects' && (
        <div className="space-y-6">
          {/* Subject Cards */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              📚 Subject Master Panel
              <span className="text-xs font-normal text-muted-foreground">
                ({topics.filter(t => t.status === 'mastered').length}/{topics.length} mastered)
              </span>
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {DEFAULT_SUBJECTS.map(subject => (
                <SubjectCardV2
                  key={subject.id}
                  subject={subject}
                  topics={topics}
                  sessions={sessions}
                  onTopicStatusChange={handleTopicStatusChange}
                  onAddTopic={handleAddTopic}
                  onStudyNow={handleStudyNow}
                />
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              ⚠️ Weak Topics Hitlist
            </h2>
            <WeakTopicsPanel topics={topics} onStatusChange={handleWeakTopicStatusChange} />
          </div>
        </div>
      )}

      {/* ─── CHARTS SECTION ─── */}
      {activeSection === 'charts' && (
        <div className="space-y-6">
          {/* Score Trend */}
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">📈 Score Trend</h2>
            <ScoreTrendChartV2 sessions={sessions} />
          </div>

          {/* Study Heatmap */}
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">🗓️ Study Heatmap (90 days)</h2>
            <StudyHeatmap sessions={sessions} />
          </div>

          {/* Recent Sessions */}
          <div className="rounded-2xl border overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/20">
              <h2 className="text-sm font-bold flex items-center gap-2">📝 Recent Sessions</h2>
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="text-3xl">📖</span>
                  <p className="text-sm font-medium mt-2">No sessions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Log your first study session!</p>
                </div>
              ) : (
                sessions.slice(0, 20).map(session => {
                  const subject = DEFAULT_SUBJECTS.find(s => s.id === session.subject_id);
                  return (
                    <div key={session.id} className="px-4 py-3 flex items-center gap-3 hover:bg-accent/20 transition-colors">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: subject?.color || '#888' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {subject?.name.split(' ')[0] || session.subject_id}
                          {session.topic && <span className="text-muted-foreground"> — {session.topic}</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {session.date} • {session.time_spent_min}min
                          {session.score_percent > 0 && ` • ${session.score_percent}%`}
                        </p>
                      </div>
                      <span className="text-lg shrink-0">
                        {['😟', '😕', '😐', '🙂', '😃'][session.confidence - 1] || '😐'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── QUIZ SECTION ─── */}
      {activeSection === 'quiz' && (
        <QuizSection />
      )}

      {/* Log Session Modal */}
      <LogSessionModal
        open={showLogSession}
        onOpenChange={(open) => {
          setShowLogSession(open);
          if (!open) refreshData();
        }}
        defaultSubject={defaultSubject}
      />
    </div>
  );
}
