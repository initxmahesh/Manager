'use client';

import { useState } from 'react';
import { LoksewaEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Trash2 } from 'lucide-react';

interface MockExamTableProps {
  entries: LoksewaEntry[] | null;
  onDelete: (id: string) => void;
}

type SortKey = 'date' | 'subject' | 'score_percent' | 'questions_attempted';

export function MockExamTable({ entries, onDelete }: MockExamTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const mockEntries = entries?.filter(e => e.mock_exam) || [];

  const sorted = [...mockEntries].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  if (mockEntries.length === 0) {
    return <p className="text-sm text-muted-foreground">No mock exam entries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {[
              { key: 'date' as SortKey, label: 'Date' },
              { key: 'subject' as SortKey, label: 'Subject' },
              { key: 'score_percent' as SortKey, label: 'Score' },
              { key: 'questions_attempted' as SortKey, label: 'Questions' },
            ].map(({ key, label }) => (
              <th key={key} className="px-3 py-2 text-left font-medium">
                <button
                  className="flex items-center gap-1 hover:text-foreground"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            ))}
            <th className="px-3 py-2 text-left font-medium">Weak Areas</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <tr key={entry.id} className="border-b hover:bg-accent/50">
              <td className="px-3 py-2">{entry.date}</td>
              <td className="px-3 py-2">{entry.subject}</td>
              <td className="px-3 py-2 font-medium">{entry.score_percent}%</td>
              <td className="px-3 py-2">{entry.questions_correct}/{entry.questions_attempted}</td>
              <td className="px-3 py-2 text-muted-foreground">{entry.weak_areas || '—'}</td>
              <td className="px-3 py-2">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(entry.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
