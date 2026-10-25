import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLessonViewer } from '../../hooks/useLessonViewer';
import { TutorChat } from '../tutor/TutorChat';
import { Alert } from '../ui/Alert';
import { BackButton } from '../ui/BackButton';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Tabs, type TabItem } from '../ui/Tabs';
import { LessonAccessDenied } from './LessonAccessDenied';

export interface LessonViewerProps {
  lessonId: string;
  onBack: () => void;
  onEnroll?: (() => void) | undefined;
  isEnrolling?: boolean | undefined;
}

type MobileLessonTab = 'lesson' | 'chat';

const LESSON_MOBILE_TABS: Array<TabItem<MobileLessonTab>> = [
  { key: 'lesson', label: 'Lección' },
  { key: 'chat', label: 'Tutor IA' },
];

export function LessonViewer({
  lessonId,
  onBack,
  onEnroll,
  isEnrolling = false,
}: LessonViewerProps) {
  const { state, handleEnroll } = useLessonViewer(lessonId, onEnroll);
  const [mobileTab, setMobileTab] = useState<MobileLessonTab>('lesson');

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
          <BackButton onClick={onBack} style={{ alignSelf: 'flex-start' }} />
        </div>
      );
    case 'ready':
      return (
        <div className="lesson-viewer-container">
          <div className="lesson-mobile-tabs">
            <Tabs
              variant="segmented"
              items={LESSON_MOBILE_TABS}
              activeTab={mobileTab}
              onChange={setMobileTab}
              aria-label="Vista en móvil"
            />
          </div>
          <Card className={`lesson-view ${mobileTab !== 'lesson' ? 'mobile-hidden' : ''}`}>
            <div className="lesson-view-nav">
              <BackButton onClick={onBack} />
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
          <div className={`tutor-chat-wrapper ${mobileTab !== 'chat' ? 'mobile-hidden' : ''}`}>
            <TutorChat lessonId={state.lesson.id} lessonTitle={state.lesson.title} />
          </div>
        </div>
      );
  }
}
