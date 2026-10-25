import { useCallback, useEffect, useState } from 'react';
import { fetchLessonById } from '../api/lessons';
import type { LessonDetail } from '../types/lesson';

export type LessonViewerState =
  | { status: 'loading' }
  | { status: 'forbidden' }
  | { status: 'error'; message: string }
  | { status: 'ready'; lesson: LessonDetail };

function isForbidden(err: unknown): boolean {
  const status = (err as Error & { status?: number }).status;
  const message = err instanceof Error ? err.message.toLowerCase() : '';
  return status === 403 || message.includes('not enrolled') || message.includes('403');
}

export interface UseLessonViewerResult {
  state: LessonViewerState;
  handleEnroll?: (() => void) | undefined;
}

export function useLessonViewer(
  lessonId: string,
  onEnroll?: (() => void) | undefined,
): UseLessonViewerResult {
  const [state, setState] = useState<LessonViewerState>({ status: 'loading' });

  const loadLesson = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const lesson = await fetchLessonById(lessonId);
      setState({ status: 'ready', lesson });
    } catch (err: unknown) {
      if (isForbidden(err)) {
        setState({ status: 'forbidden' });
      } else {
        const message = err instanceof Error ? err.message : 'Error al cargar la lección';
        setState({ status: 'error', message });
      }
    }
  }, [lessonId]);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      if (!isMounted) return;
      await loadLesson();
    }

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [loadLesson]);

  const handleEnroll = useCallback(async () => {
    if (!onEnroll) return;
    try {
      await onEnroll();
      setState({ status: 'loading' });
      const lesson = await fetchLessonById(lessonId);
      setState({ status: 'ready', lesson });
    } catch (err: unknown) {
      if (isForbidden(err)) {
        setState({ status: 'forbidden' });
      } else {
        const message =
          err instanceof Error ? err.message : 'Error al cargar la lección tras la matrícula';
        setState({ status: 'error', message });
      }
    }
  }, [lessonId, onEnroll]);

  return {
    state,
    handleEnroll: onEnroll ? handleEnroll : undefined,
  };
}
