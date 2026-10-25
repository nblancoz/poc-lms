import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TutorMessage } from '../../types/tutor';

export interface TutorMessageItemProps {
  message: TutorMessage;
  offTopicText?: string;
}

function formatTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function TutorMessageItem({
  message,
  offTopicText = 'No tengo información en esta lección para responder a eso.',
}: TutorMessageItemProps) {
  const isUser = message.role === 'user';
  const isOffTopic = !isUser && message.content.trim() === offTopicText;

  return (
    <div className={`tutor-message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`tutor-message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <div className="tutor-message-meta">
          <span className="tutor-message-sender">{isUser ? 'Tú' : 'Tutor IA'}</span>
          {message.createdAt && (
            <span className="tutor-message-time">{formatTime(message.createdAt)}</span>
          )}
        </div>
        {isOffTopic && (
          <div className="tutor-offtopic-badge">
            <span>Fuera de temario</span>
          </div>
        )}
        <div className="tutor-message-content">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
