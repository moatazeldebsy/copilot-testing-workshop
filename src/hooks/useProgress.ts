import { useState, useCallback, useEffect } from 'react';
import { allSteps } from '../data/workshopSteps';

const STORAGE_KEY = 'workshop-progress';
const QUIZ_STORAGE_KEY = 'workshop-quiz-progress';
const QUIZ_TOTAL = 3;
const NON_COMPLETABLE_PATHS = new Set(['/']);

function isCompletablePath(path: string) {
  return !NON_COMPLETABLE_PATHS.has(path);
}

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Set((JSON.parse(raw) as string[]).filter(isCompletablePath));
    }
  } catch { /* ignore */ }
  return new Set();
}

function saveProgress(completed: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

function loadQuizProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveQuizProgress(completed: Set<string>) {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify([...completed]));
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(loadProgress);
  const [quizCompleted, setQuizCompleted] = useState<Set<string>>(loadQuizProgress);

  useEffect(() => {
    saveProgress(completed);
  }, [completed]);

  useEffect(() => {
    saveQuizProgress(quizCompleted);
  }, [quizCompleted]);

  const markComplete = useCallback((path: string) => {
    if (!isCompletablePath(path)) {
      return;
    }

    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(path);
      return next;
    });
  }, []);

  const markIncomplete = useCallback((path: string) => {
    if (!isCompletablePath(path)) {
      return;
    }

    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const toggleComplete = useCallback((path: string) => {
    if (!isCompletablePath(path)) {
      return;
    }

    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (path: string) => isCompletablePath(path) && completed.has(path),
    [completed],
  );

  const markQuizComplete = useCallback((quizId: string) => {
    setQuizCompleted((prev) => {
      const next = new Set(prev);
      next.add(quizId);
      return next;
    });
  }, []);

  const isQuizComplete = useCallback((quizId: string) => quizCompleted.has(quizId), [quizCompleted]);

  const resetQuizProgress = useCallback(() => {
    setQuizCompleted(new Set());
  }, []);

  const totalSteps = allSteps.length;
  const totalQuizChecks = QUIZ_TOTAL;
  const completionUnitsDone = completed.size + Math.min(quizCompleted.size, totalQuizChecks);
  const completionUnitsTotal = totalSteps + totalQuizChecks;
  const unifiedPct = Math.round((completionUnitsDone / completionUnitsTotal) * 100);

  return {
    completed,
    quizCompleted,
    completedCount: completed.size,
    quizCompletedCount: quizCompleted.size,
    totalSteps,
    totalQuizChecks,
    completionUnitsDone,
    completionUnitsTotal,
    unifiedPct,
    markComplete,
    markIncomplete,
    toggleComplete,
    isComplete,
    markQuizComplete,
    isQuizComplete,
    resetQuizProgress,
  };
}
