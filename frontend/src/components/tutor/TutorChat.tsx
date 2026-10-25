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
    historyError,
    sendError,
    inputMessage,
    setInputMessage,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
  } = useTutorChat(lessonId);

  return (
    <div className="tutor-chat-card">
      <TutorChatHeader lessonTitle={lessonTitle} />
      {historyError && (
        <div style={{ padding: '12px 16px 0' }}>
          <Alert variant="error">{historyError}</Alert>
        </div>
      )}
      <TutorMessageList
        messages={messages}
        isLoading={isLoadingHistory}
        isSending={isSending}
        onSelectSuggestion={handleSuggestionClick}
      />
      {sendError && (
        <div style={{ padding: '0 16px 8px' }}>
          <Alert variant="error">{sendError}</Alert>
        </div>
      )}
      <TutorChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        disabled={isSending}
      />
    </div>
  );
}
