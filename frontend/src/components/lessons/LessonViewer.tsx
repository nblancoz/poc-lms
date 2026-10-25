import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLessonViewer } from '../../hooks/useLessonViewer';
import { TutorChat } from '../tutor/TutorChat';
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
  const { state, handleEnroll } = useLessonViewer(lessonId, onEnroll);

  switch (state.status) {
    case 'loading':
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <span className="spinner-md" />
        </div>
      );
    case 'forbidden':
      return (
        <LessonAccessDenied onBack={onBack} onEnroll={handleEnroll} isEnrolling={isEnrolling} />
      );
    case 'error':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Alert variant="error">{state.message}</Alert>
          <Button variant="outline" size="sm" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
            Volver al temario
          </Button>
        </div>
      );
    case 'ready':
      return (
        <div className="lesson-viewer-container">
          <Card className="lesson-view">
            <div className="lesson-view-nav">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
                Volver al temario
              </Button>
              <Badge variant="enrolled">Lección {state.lesson.order}</Badge>
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
                {state.lesson.title}
              </h2>
            </div>
            <div className="lesson-content">
              <Markdown remarkPlugins={[remarkGfm]}>{state.lesson.content}</Markdown>
            </div>
          </Card>
          <TutorChat lessonId={state.lesson.id} lessonTitle={state.lesson.title} />
        </div>
      );
  }
}
