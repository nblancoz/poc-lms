import { type KeyboardEvent, type SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { fetchTutorChatHistory, sendTutorChatMessage } from '../api/tutor';
import type { TutorInteractionStatus, TutorMessage } from '../types/tutor';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';

export interface UseTutorChatResult {
  messages: TutorMessage[];
  isLoadingHistory: boolean;
  isSending: boolean;
  status: TutorInteractionStatus;
  historyError: string | null;
  sendError: string | null;
  lastFailedMessage: string | null;
  isOnline: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (suggestion: string) => void;
  retryLastMessage: () => void;
  retryLoadHistory: () => void;
  clearErrors: () => void;
  isListening: boolean;
  isSpeechSupported: boolean;
  speechError: string | null;
  handleToggleListening: () => void;
  retrySpeech: () => void;
  isTtsSupported: boolean;
  speakingMessageId: string | null;
  toggleSpeech: (messageId: string, text: string) => void;
}

export function useTutorChat(lessonId: string): UseTutorChatResult {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const {
    isListening,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
    clearError: clearSpeechError,
  } = useSpeechRecognition({
    onTranscript: useCallback((transcript: string) => {
      setInputMessage(transcript);
    }, []),
  });

  const {
    isSupported: isTtsSupported,
    speakingMessageId,
    toggle: toggleSpeech,
    stop: stopSpeech,
  } = useSpeechSynthesis();

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeech();
      startListening();
    }
  }, [isListening, startListening, stopListening, stopSpeech]);

  const handleToggleSpeech = useCallback(
    (messageId: string, text: string) => {
      if (isListening) {
        stopListening();
      }
      toggleSpeech(messageId, text);
    },
    [isListening, stopListening, toggleSpeech],
  );

  const retrySpeech = useCallback(() => {
    clearSpeechError();
    stopSpeech();
    startListening();
  }, [clearSpeechError, startListening, stopSpeech]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setSendError(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadHistory = useCallback(async () => {
    if (!lessonId) return;

    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const history = await fetchTutorChatHistory(lessonId);
      setMessages(history);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar el historial del chat';
      setHistoryError(message);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [lessonId]);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      if (!isMounted) return;
      await loadHistory();
    }

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [loadHistory]);

  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return false;

      setSendError(null);

      const optimisticUserMessage: TutorMessage = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMessage]);
      setIsSending(true);

      try {
        const response = await sendTutorChatMessage(lessonId, trimmed);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticUserMessage.id),
          response.userMessage,
          response.assistantMessage,
        ]);
        setLastFailedMessage(null);
        return true;
      } catch (err: unknown) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
        setLastFailedMessage(trimmed);

        let message = 'No se pudo enviar el mensaje al tutor';
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          message = 'Sin conexión a internet. Comprueba tu red e inténtalo de nuevo.';
        } else if (err instanceof Error) {
          const lower = err.message.toLowerCase();
          if (lower.includes('network') || lower.includes('failed to fetch')) {
            message = 'Error de conexión con el servidor. Comprueba tu red.';
          } else if (lower.includes('500') || lower.includes('internal server error')) {
            message = 'El servicio de IA tuvo un problema temporal. Puedes reintentar ahora.';
          } else {
            message = err.message;
          }
        }
        setSendError(message);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [lessonId, isSending],
  );

  const handleSend = useCallback(
    async (textToSend?: string) => {
      if (isListening) {
        stopListening();
      }

      const text = (textToSend ?? inputMessage).trim();
      if (!text || isSending) return;

      if (!textToSend) {
        setInputMessage('');
      }

      const success = await sendMessage(text);
      if (!success && !textToSend) {
        setInputMessage(text);
      }
    },
    [inputMessage, isListening, isSending, sendMessage, stopListening],
  );

  const retryLastMessage = useCallback(() => {
    if (lastFailedMessage && !isSending) {
      setSendError(null);
      void sendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, isSending, sendMessage]);

  const retryLoadHistory = useCallback(() => {
    if (!isLoadingHistory) {
      void loadHistory();
    }
  }, [isLoadingHistory, loadHistory]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSend();
    },
    [handleSend],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      void handleSend(suggestion);
    },
    [handleSend],
  );

  const clearErrors = useCallback(() => {
    setHistoryError(null);
    setSendError(null);
    setLastFailedMessage(null);
    clearSpeechError();
  }, [clearSpeechError]);

  const status: TutorInteractionStatus = isListening
    ? 'listening'
    : !isOnline
      ? 'offline'
      : isSending
        ? 'thinking'
        : historyError || sendError
          ? 'error'
          : 'ready';

  return {
    messages,
    isLoadingHistory,
    isSending,
    status,
    historyError,
    sendError,
    lastFailedMessage,
    isOnline,
    inputMessage,
    setInputMessage,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
    retryLastMessage,
    retryLoadHistory,
    clearErrors,
    isListening,
    isSpeechSupported,
    speechError,
    handleToggleListening,
    retrySpeech,
    isTtsSupported,
    speakingMessageId,
    toggleSpeech: handleToggleSpeech,
  };
}
