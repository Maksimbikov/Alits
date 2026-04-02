export default function MessageList({ messages, pendingStatus, loading }) {
  return (
    <div className="messages-wrap">
      {messages.map((message) => (
        <div
          key={message.id}
          className={message.role === 'assistant' ? 'message assistant' : 'message user'}
        >
          <div className="message-role">{message.role === 'assistant' ? 'Alit' : 'Вы'}</div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}

      {loading && (
        <div className="message assistant">
          <div className="message-role">Alit</div>
          <div className="message-content">
            <div className="typing-row">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <div className="status-chip">{pendingStatus}</div>
          </div>
        </div>
      )}
    </div>
  );
}
