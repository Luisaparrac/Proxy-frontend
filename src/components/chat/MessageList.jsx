import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

const SUGGESTIONS = [
  '¿Qué es el patrón Proxy?',
  'Dame ideas para un proyecto de software',
  'Explícame qué es el rate limiting',
];

export function MessageList({ messages, isWaitingReply, onSuggestion, canSend }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isWaitingReply]);

  if (!messages.length && !isWaitingReply) {
    return (
      <div className="chat-empty">
        <h1 className="chat-empty__title">Escribe un prompt para empezar</h1>
        <p className="chat-empty__text">
          Cada respuesta descuenta tokens de tu cuota mensual y suma una solicitud al contador del minuto.
        </p>
        <div className="chat-empty__suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="chip"
              onClick={() => onSuggestion(suggestion)}
              disabled={!canSend}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
      {isWaitingReply && (
        <div className="bubble bubble--ai bubble--typing" aria-label="La IA está generando una respuesta">
          <span /><span /><span />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
