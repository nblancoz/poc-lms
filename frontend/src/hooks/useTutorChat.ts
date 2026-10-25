import { type KeyboardEvent, type SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { fetchTutorChatHistory, sendTutorChatMessage } from '../api/tutor';
import type { TutorMessage } from '../types/tutor';

export interface UseTutorChatResult {
  messages: TutorMessage[];
  isLoadingHistory: boolean;
  isSending: boolean;
  historyError: string | null;
  sendError: string | null;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (suggestion: string) => void;
  clearErrors: () => void;
}

export function useTutorChat(lessonId: string): UseTutorChatResult {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');

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
        return true;
      } catch (err: unknown) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
        const message =
          err instanceof Error ? err.message : 'No se pudo enviar el mensaje al tutor';
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
    [inputMessage, isSending, sendMessage],
  );

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
  }, []);

  return {
    messages,
    isLoadingHistory,
    isSending,
    historyError,
    sendError,
    inputMessage,
    setInputMessage,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
    clearErrors,
  };
}
