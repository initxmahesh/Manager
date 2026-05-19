'use client';

import { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, QuizQuestion } from '@/lib/quiz-data';
import { cn } from '@/lib/utils';

type QuizState = 'select' | 'playing' | 'result';

export function QuizSection() {
  const [state, setState] = useState<QuizState>('select');
  const [category, setCategory] = useState<string>('gk');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const startQuiz = useCallback((cat: string) => {
    const catQuestions = QUIZ_QUESTIONS.filter(q => q.category === cat);
    // Shuffle
    const shuffled = [...catQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCategory(cat);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setState('playing');
  }, []);

  const handleAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);
    const isCorrect = optionIdx === questions[currentIdx].correctIndex;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, optionIdx]);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setState('result');
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const currentQ = questions[currentIdx];
  const catInfo = QUIZ_CATEGORIES.find(c => c.id === category);

  // ─── SELECT SCREEN ────────────────────────────────────────────────
  if (state === 'select') {
    return (
      <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-900/30 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/10 dark:to-pink-950/10 p-6">
        <div className="text-center mb-6">
          <span className="text-4xl">🧠</span>
          <h3 className="text-xl font-bold mt-2">Quick Quiz Practice</h3>
          <p className="text-sm text-muted-foreground mt-1">Test your knowledge — 10 random questions</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {QUIZ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => startQuiz(cat.id)}
              className="flex items-center gap-3 p-4 rounded-xl border-2 bg-white/60 dark:bg-white/5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
              style={{ borderColor: `${cat.color}40` }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <p className="text-sm font-bold">{cat.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {QUIZ_QUESTIONS.filter(q => q.category === cat.id).length} questions available
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ────────────────────────────────────────────────
  if (state === 'result') {
    const percent = Math.round((score / questions.length) * 100);
    const emoji = percent >= 80 ? '🏆' : percent >= 60 ? '👍' : percent >= 40 ? '😐' : '📚';

    return (
      <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-900/30 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/10 dark:to-pink-950/10 p-6">
        <div className="text-center">
          <span className="text-5xl">{emoji}</span>
          <h3 className="text-2xl font-bold mt-3">Quiz Complete!</h3>
          <p className="text-lg font-semibold mt-2" style={{ color: catInfo?.color }}>
            {score}/{questions.length} correct — {percent}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {percent >= 80 ? 'Excellent! You are well prepared! 🎉' :
             percent >= 60 ? 'Good job! Keep practicing! 💪' :
             percent >= 40 ? 'Not bad, but more revision needed. 📖' :
             'Time to study this topic more carefully. 🔄'}
          </p>

          {/* Answer review */}
          <div className="mt-5 text-left space-y-2 max-h-[300px] overflow-y-auto">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <div key={q.id} className={cn(
                  'p-3 rounded-lg border text-sm',
                  isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                )}>
                  <p className="font-medium">{i + 1}. {q.question}</p>
                  <p className="text-xs mt-1">
                    {isCorrect ? '✅' : '❌'} Your answer: {q.options[userAnswer ?? 0]}
                    {!isCorrect && <span className="text-emerald-600 dark:text-emerald-400 ml-2">→ Correct: {q.options[q.correctIndex]}</span>}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(category)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: catInfo?.color }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => setState('select')}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border hover:bg-accent transition-colors"
            >
              ← Back to Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING SCREEN ───────────────────────────────────────────────
  return (
    <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-900/30 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/10 dark:to-pink-950/10 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-muted/30">
        <div
          className="h-full rounded-r-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: catInfo?.color }}
        />
      </div>

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${catInfo?.color}15`, color: catInfo?.color }}>
            {catInfo?.emoji} {catInfo?.label}
          </span>
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <h4 className="text-base sm:text-lg font-bold leading-relaxed mb-5">
          {currentQ.question}
        </h4>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === currentQ.correctIndex;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                  !showResult && 'hover:bg-accent hover:border-foreground/20 hover:-translate-y-0.5',
                  !showResult && 'border-border bg-white/60 dark:bg-white/5',
                  showResult && isCorrect && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200',
                  showResult && isSelected && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200',
                  showResult && !isSelected && !isCorrect && 'opacity-50',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn(
                    'h-6 w-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0',
                    showResult && isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                    showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                    'border-muted-foreground/30'
                  )}>
                    {showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && currentQ.explanation && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
              💡 {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {selectedAnswer !== null && (
          <button
            onClick={nextQuestion}
            className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: catInfo?.color }}
          >
            {currentIdx + 1 >= questions.length ? '📊 See Results' : '→ Next Question'}
          </button>
        )}

        {/* Score so far */}
        <div className="mt-3 text-center text-xs text-muted-foreground">
          Score: {score}/{currentIdx + (selectedAnswer !== null ? 1 : 0)} • {questions.length - currentIdx - 1} remaining
        </div>
      </div>
    </div>
  );
}
