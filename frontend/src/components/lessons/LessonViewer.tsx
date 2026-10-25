import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { fetchLessonById } from '../../api/lessons';
import type { LessonDetail } from '../../types/lesson';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LessonAccessDenied } from './LessonAccessDenied';

export interface LessonViewerProps {
  lessonId: string;
  onBack: () => void;
  onEnroll?: (() => void) | undefined;
  isEnrolling?: boolean | undefined;
}

export function LessonViewer({
  lessonId,
  onBack,
  onEnroll,
  isEnrolling = false,
}: LessonViewerProps) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLesson() {
      try {
        const data = await fetchLessonById(lessonId);
        if (isMounted) {
          setLesson(data);
          setIsForbidden(false);
          setError(null);
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        const status = (err as Error & { status?: number }).status;
        const message = err instanceof Error ? err.message : '';

        if (
          status === 403 ||
          message.toLowerCase().includes('not enrolled') ||
          message.includes('403')
        ) {
          setIsForbidden(true);
        } else {
          setError(message || 'Error al cargar la lección');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  async function handleEnrollClick() {
    if (!onEnroll) return;
    try {
      await onEnroll();
      setIsLoading(true);
      const data = await fetchLessonById(lessonId);
      setLesson(data);
      setIsForbidden(false);
      setError(null);
    } catch (err: unknown) {
      const status = (err as Error & { status?: number }).status;
      const message = err instanceof Error ? err.message : '';

      if (
        status === 403 ||
        message.toLowerCase().includes('not enrolled') ||
        message.includes('403')
      ) {
        setIsForbidden(true);
      } else {
        setError(message || 'Error al cargar la lección tras la matrícula');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <span className="spinner-md" />
      </div>
    );
  }

  if (isForbidden) {
    return (
      <LessonAccessDenied
        onBack={onBack}
        onEnroll={onEnroll ? () => void handleEnrollClick() : undefined}
        isEnrolling={isEnrolling}
      />
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Alert variant="error">{error}</Alert>
        <Button variant="outline" size="sm" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
          Volver al temario
        </Button>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <Card className="lesson-view">
      <div className="lesson-view-nav">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
          Volver al temario
        </Button>
        <Badge variant="enrolled">Lección {lesson.order}</Badge>
      </div>

      <div>
        <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
          {lesson.title}
        </h2>
      </div>

      <div className="lesson-content">{lesson.content}</div>
    </Card>
  );
}
