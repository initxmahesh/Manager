'use client';

import { useState } from 'react';
import { useLoksewa } from '@/hooks/useLoksewa';
import { SubjectCards } from '@/components/loksewa/subject-cards';
import { MockExamTable } from '@/components/loksewa/mock-exam-table';
import { ScoreChart } from '@/components/loksewa/score-chart';
import { WeakAreas } from '@/components/loksewa/weak-areas';
import { AddEntryForm } from '@/components/loksewa/add-entry-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { Plus } from 'lucide-react';

export default function LoksewaPage() {
  const { entries, loading, createEntry, deleteEntry } = useLoksewa();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loksewa Tracker</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <SubjectCards entries={entries} />

      <Card>
        <CardHeader>
          <CardTitle>Score Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreChart entries={entries} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mock Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <MockExamTable entries={entries} onDelete={deleteEntry} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weak Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <WeakAreas entries={entries} />
        </CardContent>
      </Card>

      <AddEntryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={createEntry}
      />
    </div>
  );
}
