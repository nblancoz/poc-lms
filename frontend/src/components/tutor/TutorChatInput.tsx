import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import { Button } from '../ui/Button';

export interface TutorChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function TutorChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled = false,
  placeholder = 'Escribe tu duda sobre esta lección...',
  maxLength = 1000,
}: TutorChatInputProps) {
  return (
    <form className="tutor-chat-input-form" onSubmit={onSubmit}>
      <input
        type="text"
        className="tutor-chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
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
  );
}
