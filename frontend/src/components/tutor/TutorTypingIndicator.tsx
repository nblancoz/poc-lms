export function TutorTypingIndicator() {
  return (
    <div className="tutor-message-row assistant-row">
      <div className="tutor-message-bubble assistant-bubble typing-bubble">
        <div className="typing-dots" aria-label="El tutor está respondiendo">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <span className="typing-text">El tutor está respondiendo...</span>
      </div>
    </div>
  );
}
