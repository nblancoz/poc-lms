import { SparklesIcon } from '@heroicons/react/20/solid';
import type { TutorInteractionStatus } from '../../types/tutor';
import { StatusDot } from '../ui/StatusDot';

export interface TutorChatHeaderProps {
  lessonTitle: string;
  status: TutorInteractionStatus;
}

export function TutorChatHeader({ lessonTitle, status }: TutorChatHeaderProps) {
  const renderStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <span className="tutor-status-badge status-listening" role="status">
            <StatusDot variant="danger" /> Escuchando...
          </span>
        );
      case 'thinking':
        return (
          <span className="tutor-status-badge status-thinking" role="status">
            <StatusDot variant="noaccess" /> Pensando...
          </span>
        );
      case 'offline':
        return (
          <span className="tutor-status-badge status-offline" role="status">
            <StatusDot variant="danger" /> Sin conexión
          </span>
        );
      case 'error':
        return (
          <span className="tutor-status-badge status-error" role="status">
            <StatusDot variant="danger" /> Incidencia en servicio
          </span>
        );
      case 'ready':
      default:
        return (
          <span className="tutor-status-badge status-ready" role="status">
            <StatusDot variant="enrolled" /> En línea
          </span>
        );
    }
  };

  return (
    <div className="tutor-chat-header">
      <div className="tutor-chat-header-title">
        <div className="tutor-chat-avatar">
          <SparklesIcon className="tutor-avatar-icon" aria-hidden="true" />
        </div>
        <div>
          <div className="tutor-chat-heading-row">
            <h3 className="tutor-chat-heading">Tutor de IA</h3>
            {renderStatusBadge()}
          </div>
          <p className="tutor-chat-subtitle">
            Resuelve tus dudas sobre: <em>{lessonTitle}</em>
          </p>
        </div>
      </div>
    </div>
  );
}
