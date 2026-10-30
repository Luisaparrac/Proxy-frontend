import { formatNumber, formatTime } from '../../utils/format';

const NOTICE_TITLES = {
  402: 'Cuota agotada',
  429: 'Límite por minuto alcanzado',
};

export function MessageBubble({ message }) {
  if (message.role === 'notice') {
    return (
      <div className="notice" role="alert">
        <strong>{NOTICE_TITLES[message.status] ?? 'No se pudo enviar'}</strong>
        <p>{message.text}</p>
      </div>
    );
  }

  const isUser = message.role === 'user';
  return (
    <article className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}>
      <p className="bubble__text">{message.text}</p>
      <footer className="bubble__meta">
        {formatTime(message.createdAt)}
        {!isUser && message.tokens != null && (
          <> · {formatNumber(message.tokens)} tokens · {(message.latencyMs / 1000).toFixed(1)} s</>
        )}
      </footer>
    </article>
  );
}
