'use client';

import { LoksewaEntry, LoksewaSubject } from '@/lib/types';
import { LOKSEWA_SUBJECTS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface SubjectCardsProps {
  entries: LoksewaEntry[] | null;
}

export function SubjectCards({ entries }: SubjectCardsProps) {
  const getSubjectStats = (subject: LoksewaSubject) => {
    const subjectEntries = entries?.filter(e => e.subject === subject) || [];
    const totalAttempted = subjectEntries.reduce((sum, e) => sum + e.questions_attempted, 0);
    const avgScore = subjectEntries.length > 0
      ? Math.round(subjectEntries.reduce((sum, e) => sum + e.score_percent, 0) / subjectEntries.length)
      : 0;
    return { totalAttempted, avgScore, count: subjectEntries.length };
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {LOKSEWA_SUBJECTS.map((subject) => {
        const stats = getSubjectStats(subject);
        return (
          <Card key={subject}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-loksewa" />
                <span className="text-xs font-medium truncate">{subject}</span>
              </div>
              <p className="mt-2 text-xl font-bold">{stats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">{stats.totalAttempted} questions</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
