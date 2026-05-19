'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_SUBJECTS, SESSION_TYPE_LABELS, CONFIDENCE_EMOJIS, SessionType } from '@/lib/loksewa-types';
import { cn } from '@/lib/utils';

interface LogSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject?: string;
}

export function LogSessionModal({ open, onOpenChange, defaultSubject }: LogSessionModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [subjectId, setSubjectId] = useState(defaultSubject || '');
  const [topic, setTopic] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('deep_study');
  const [timeSpent, setTimeSpent] = useState(45);
  const [confidence, setConfidence] = useState(3);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [weakTopics, setWeakTopics] = useState('');
  const [notes, setNotes] = useState('');

  const isMCQ = sessionType === 'mcq_practice' || sessionType === 'past_paper';

  const handleSubmit = async () => {
    if (!subjectId) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/loksewa/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          subject_id: subjectId,
          topic,
          session_type: sessionType,
          time_spent_min: timeSpent,
          confidence,
          questions_attempted: isMCQ ? questionsAttempted : 0,
          questions_correct: isMCQ ? questionsCorrect : 0,
          weak_topics: weakTopics,
          notes,
        }),
      });

      if (res.ok) {
        onOpenChange(false);
        // Reset form
        setTopic('');
        setSessionType('deep_study');
        setTimeSpent(45);
        setConfidence(3);
        setQuestionsAttempted(0);
        setQuestionsCorrect(0);
        setWeakTopics('');
        setNotes('');
      }
    } catch (err) {
      console.error('Failed to log session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">📖 Log Study Session</DialogTitle>
          <DialogDescription>Record what you studied today.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {DEFAULT_SUBJECTS.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div>
            <Label>Topic</Label>
            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., OSPF Routing Protocol" />
          </div>

          {/* Session Type */}
          <div>
            <Label>Session Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(Object.entries(SESSION_TYPE_LABELS) as [SessionType, { label: string; emoji: string }][]).map(([key, { label, emoji }]) => (
                <button
                  key={key}
                  onClick={() => setSessionType(key)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                    sessionType === key
                      ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Time + Quick buttons */}
          <div>
            <Label>Time Spent (minutes)</Label>
            <div className="flex items-center gap-2 mt-1">
              {[30, 45, 60, 90, 120].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeSpent(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    timeSpent === t ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950/20' : 'border-border hover:bg-accent'
                  )}
                >
                  {t}m
                </button>
              ))}
              <Input
                type="number"
                value={timeSpent}
                onChange={e => setTimeSpent(parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
          </div>

          {/* MCQ fields */}
          {isMCQ && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30 border">
              <div>
                <Label>Questions Attempted</Label>
                <Input type="number" value={questionsAttempted} onChange={e => setQuestionsAttempted(parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Questions Correct</Label>
                <Input type="number" value={questionsCorrect} onChange={e => setQuestionsCorrect(parseInt(e.target.value) || 0)} />
              </div>
              {questionsAttempted > 0 && (
                <div className="col-span-2 text-sm font-medium text-center">
                  Score: {Math.round((questionsCorrect / questionsAttempted) * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Confidence */}
          <div>
            <Label>Confidence After Session</Label>
            <div className="flex items-center gap-2 mt-1">
              {CONFIDENCE_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setConfidence(i + 1)}
                  className={cn(
                    'text-2xl p-1 rounded-lg transition-all',
                    confidence === i + 1 ? 'bg-indigo-100 dark:bg-indigo-900/30 scale-110' : 'opacity-40 hover:opacity-70'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Weak topics */}
          <div>
            <Label>Weak Topics Encountered</Label>
            <Input value={weakTopics} onChange={e => setWeakTopics(e.target.value)} placeholder="e.g., Subnetting, OSPF areas (comma separated)" />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you learn? What was confusing?" />
          </div>

          <Button onClick={handleSubmit} disabled={!subjectId || submitting} className="w-full">
            {submitting ? '💾 Saving...' : '✅ Log Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
