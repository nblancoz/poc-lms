import { ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';

export interface TutorSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

export function TutorSuggestions({
  suggestions,
  onSelectSuggestion,
  disabled = false,
}: TutorSuggestionsProps) {
  return (
    <div className="tutor-chat-empty">
      <div className="tutor-chat-empty-icon">
        <ChatBubbleLeftRightIcon style={{ width: 24, height: 24 }} aria-hidden="true" />
      </div>
      <p className="tutor-chat-empty-title">¿Tienes alguna duda sobre la lección?</p>
      <p className="tutor-chat-empty-desc">
        Pregúntame sobre vocabulario, pronunciación, o practiquemos los diálogos de esta unidad.
      </p>
      <div className="tutor-suggestions-list">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="tutor-suggestion-chip"
            onClick={() => onSelectSuggestion(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
