export function TutorTypingIndicator() {
  return (
    <div className="tutor-message-row assistant-row">
      <div className="tutor-message-bubble assistant-bubble typing-bubble">
        <div className="typing-dots" role="status" aria-label="El tutor está escribiendo">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
