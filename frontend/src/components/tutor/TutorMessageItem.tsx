import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import type { TutorMessage } from '../../types/tutor';

export interface TutorMessageItemProps {
  message: TutorMessage;
  offTopicText?: string | undefined;
  isSpeaking?: boolean | undefined;
  onToggleSpeak?: ((messageId: string, content: string) => void) | undefined;
  isTtsSupported?: boolean | undefined;
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
  isSpeaking = false,
  onToggleSpeak,
  isTtsSupported = false,
}: TutorMessageItemProps) {
  const isUser = message.role === 'user';
  const isOffTopic = !isUser && message.content.trim() === offTopicText;

  return (
    <div className={`tutor-message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`tutor-message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <div className="tutor-message-meta">
          <div className="tutor-message-meta-left">
            <span className="tutor-message-sender">{isUser ? 'Tú' : 'Tutor IA'}</span>
            {message.createdAt && (
              <span className="tutor-message-time">{formatTime(message.createdAt)}</span>
            )}
          </div>
          {!isUser && isTtsSupported && onToggleSpeak && (
            <button
              type="button"
              className={`tutor-speak-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={() => onToggleSpeak(message.id, message.content)}
              aria-label={
                isSpeaking ? 'Detener lectura en voz alta' : 'Escuchar respuesta en voz alta'
              }
              title={isSpeaking ? 'Detener lectura en voz alta' : 'Escuchar respuesta en voz alta'}
            >
              {isSpeaking ? (
                <>
                  <SpeakerXMarkIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
                  <span>Detener</span>
                </>
              ) : (
                <>
                  <SpeakerWaveIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
                  <span>Escuchar</span>
                </>
              )}
            </button>
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
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {message.content}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
