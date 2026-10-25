import { useTutorChat } from '../../hooks/useTutorChat';
import { Alert } from '../ui/Alert';
import { TutorChatHeader } from './TutorChatHeader';
import { TutorChatInput } from './TutorChatInput';
import { TutorMessageList } from './TutorMessageList';

export interface TutorChatProps {
  lessonId: string;
  lessonTitle: string;
}

export function TutorChat({ lessonId, lessonTitle }: TutorChatProps) {
  const {
    messages,
    isLoadingHistory,
    isSending,
    status,
    historyError,
    sendError,
    lastFailedMessage,
    inputMessage,
    setInputMessage,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
    retryLastMessage,
    retryLoadHistory,
  } = useTutorChat(lessonId);

  return (
    <div className="tutor-chat-card">
      <TutorChatHeader lessonTitle={lessonTitle} status={status} />
      {status === 'offline' && (
        <div className="tutor-chat-alert-container">
          <Alert variant="warning">
            <span>
              Has perdido la conexión a internet. Los mensajes se reanudarán cuando vuelvas a
              conectarte.
            </span>
          </Alert>
        </div>
      )}
      {historyError && (
        <div className="tutor-chat-alert-container">
          <Alert variant="error">
            <div className="chat-error-row">
              <span>{historyError}</span>
              <button
                type="button"
                className="chat-recovery-btn"
                onClick={retryLoadHistory}
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? 'Reintentando...' : 'Reintentar carga'}
              </button>
            </div>
          </Alert>
        </div>
      )}
      <TutorMessageList
        messages={messages}
        isLoading={isLoadingHistory}
        isSending={isSending}
        onSelectSuggestion={handleSuggestionClick}
      />
      {sendError && (
        <div className="tutor-chat-alert-container">
          <Alert variant="error">
            <div className="chat-error-row">
              <span>{sendError}</span>
              {lastFailedMessage && (
                <button
                  type="button"
                  className="chat-recovery-btn"
                  onClick={retryLastMessage}
                  disabled={isSending}
                >
                  {isSending ? 'Reintentando...' : 'Reintentar pregunta'}
                </button>
              )}
            </div>
          </Alert>
        </div>
      )}
      <TutorChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        disabled={isSending || status === 'offline'}
      />
    </div>
  );
}
