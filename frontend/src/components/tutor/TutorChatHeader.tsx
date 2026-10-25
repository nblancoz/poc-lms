import { SparklesIcon } from '@heroicons/react/20/solid';
import { Badge } from '../ui/Badge';

export interface TutorChatHeaderProps {
  lessonTitle: string;
}

export function TutorChatHeader({ lessonTitle }: TutorChatHeaderProps) {
  return (
    <div className="tutor-chat-header">
      <div className="tutor-chat-header-title">
        <div className="tutor-chat-avatar">
          <SparklesIcon className="tutor-avatar-icon" aria-hidden="true" />
        </div>
        <div>
          <div className="tutor-chat-heading-row">
            <h3 className="tutor-chat-heading">Tutor de IA</h3>
            <Badge variant="enrolled">En línea</Badge>
          </div>
          <p className="tutor-chat-subtitle">
            Resuelve tus dudas sobre: <em>{lessonTitle}</em>
          </p>
        </div>
      </div>
    </div>
  );
}
