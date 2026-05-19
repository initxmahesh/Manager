'use client';

import { LoksewaEntry } from '@/lib/types';
import { LOKSEWA_SUBJECTS, CATEGORY_COLORS } from '@/lib/constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScoreChartProps {
  entries: LoksewaEntry[] | null;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Networking': '#1D9E75',
  'Constitution & Law': '#378ADD',
  'GK': '#F59E0B',
  'Electronics': '#7C3AED',
  'Telecom Systems': '#EC4899',
  'Management': '#6B7280',
};

export function ScoreChart({ entries }: ScoreChartProps) {
  const mockEntries = entries?.filter(e => e.mock_exam) || [];

  if (mockEntries.length === 0) {
    return <p className="text-sm text-muted-foreground">No mock exam data to chart.</p>;
  }

  // Group by date and subject
  const dates = [...new Set(mockEntries.map(e => e.date))].sort();
  const chartData = dates.map(date => {
    const point: Record<string, string | number> = { date };
    LOKSEWA_SUBJECTS.forEach(subject => {
      const entry = mockEntries.find(e => e.date === date && e.subject === subject);
      if (entry) point[subject] = entry.score_percent;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis domain={[0, 100]} className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {LOKSEWA_SUBJECTS.map(subject => (
          <Line
            key={subject}
            type="monotone"
            dataKey={subject}
            stroke={SUBJECT_COLORS[subject]}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
