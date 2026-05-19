'use client';

import { StudySession, DEFAULT_SUBJECTS } from '@/lib/loksewa-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface ScoreTrendChartV2Props {
  sessions: StudySession[];
}

export function ScoreTrendChartV2({ sessions }: ScoreTrendChartV2Props) {
  const mockSessions = sessions.filter(s => s.questions_attempted > 0 && s.score_percent > 0);

  if (mockSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-3">📈</span>
        <p className="text-sm font-medium">No score data yet</p>
        <p className="text-xs text-muted-foreground mt-1">Log MCQ practice or mock exams to see your trend</p>
      </div>
    );
  }

  // Group by date, get avg score per subject per date
  const dates = [...new Set(mockSessions.map(s => s.date))].sort();
  const chartData = dates.map(date => {
    const point: Record<string, string | number> = { date: date.slice(5) }; // MM-DD format
    DEFAULT_SUBJECTS.forEach(sub => {
      const subSessions = mockSessions.filter(s => s.date === date && s.subject_id === sub.id);
      if (subSessions.length > 0) {
        point[sub.id] = Math.round(subSessions.reduce((s, m) => s + m.score_percent, 0) / subSessions.length);
      }
    });
    return point;
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="4 4" label={{ value: '60% Pass', fontSize: 10, fill: '#EF4444' }} />
          <ReferenceLine y={75} stroke="#10B981" strokeDasharray="4 4" label={{ value: '75% Target', fontSize: 10, fill: '#10B981' }} />
          {DEFAULT_SUBJECTS.map(sub => (
            <Line
              key={sub.id}
              type="monotone"
              dataKey={sub.id}
              name={sub.name.split(' ')[0]}
              stroke={sub.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
