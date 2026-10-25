import type { TutorMessage } from '../../types/tutor';
import { TutorMessageItem } from './TutorMessageItem';
import { TutorSuggestions } from './TutorSuggestions';
import { TutorTypingIndicator } from './TutorTypingIndicator';

export interface TutorMessageListProps {
  messages: TutorMessage[];
  isLoading: boolean;
  isSending: boolean;
  onSelectSuggestion: (suggestion: string) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  '¿Cómo se pronuncia el vocabulario de esta lección?',
  '¿Podemos practicar uno de los diálogos?',
  '¿Puedes darme otro ejemplo práctico con las frases clave?',
];

export function TutorMessageList({
  messages,
  isLoading,
  isSending,
  onSelectSuggestion,
  suggestions = DEFAULT_SUGGESTIONS,
}: TutorMessageListProps) {
  return (
    <div
      className={`tutor-chat-messages ${messages.length > 0 ? 'has-messages' : ''}`}
      role="log"
      aria-live="polite"
    >
      {isLoading ? (
        <div className="tutor-chat-loading">
          <span className="spinner-sm" />
          <span className="tutor-chat-loading-text">Cargando conversación previa...</span>
        </div>
      ) : messages.length === 0 ? (
        <TutorSuggestions
          suggestions={suggestions}
          onSelectSuggestion={onSelectSuggestion}
          disabled={isSending}
        />
      ) : (
        <div className="tutor-messages-list">
          {messages.map((msg: TutorMessage) => (
            <TutorMessageItem key={msg.id} message={msg} />
          ))}
          {isSending && <TutorTypingIndicator />}
        </div>
      )}
    </div>
  );
}
