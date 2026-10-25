import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import { Button } from '../ui/Button';

export interface TutorChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  maxLength?: number | undefined;
  isListening?: boolean | undefined;
  isSpeechSupported?: boolean | undefined;
  onToggleListening?: (() => void) | undefined;
}

export function TutorChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled = false,
  placeholder = 'Escribe tu duda sobre esta lección...',
  maxLength = 1000,
  isListening = false,
  isSpeechSupported = false,
  onToggleListening,
}: TutorChatInputProps) {
  return (
    <div className="tutor-chat-input-wrapper">
      {isListening && (
        <div className="tutor-mic-status-bar" role="status" aria-live="polite">
          <span className="mic-recording-pulse" aria-hidden="true" />
          <span className="mic-status-text">Escuchando... Di tu pregunta en voz alta</span>
          {onToggleListening && (
            <button
              type="button"
              className="mic-stop-btn"
              onClick={onToggleListening}
              aria-label="Detener dictado"
            >
              Detener
            </button>
          )}
        </div>
      )}
      <form className="tutor-chat-input-form" onSubmit={onSubmit}>
        {isSpeechSupported && onToggleListening && (
          <button
            type="button"
            className={`tutor-mic-btn ${isListening ? 'is-listening' : ''}`}
            onClick={onToggleListening}
            disabled={disabled}
            aria-label={isListening ? 'Detener dictado por voz' : 'Dictar pregunta por voz'}
            title={isListening ? 'Detener dictado por voz' : 'Dictar pregunta por voz'}
          >
            <MicrophoneIcon style={{ width: 16, height: 16 }} aria-hidden="true" />
          </button>
        )}
        <input
          type="text"
          className="tutor-chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isListening ? 'Escuchando tu voz...' : placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensaje"
        >
          <PaperAirplaneIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
          <span>Enviar</span>
        </Button>
      </form>
    </div>
  );
}
