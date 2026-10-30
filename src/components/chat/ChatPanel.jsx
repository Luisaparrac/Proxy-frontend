import { MessageList } from './MessageList';
import { PromptComposer } from './PromptComposer';

export function ChatPanel({ messages, isWaitingReply, block, remainingTokens, onSend, onUpgrade, canUpgrade }) {
  return (
    <section className="chat-panel" aria-label="Chat con la IA">
      <MessageList
        messages={messages}
        isWaitingReply={isWaitingReply}
        onSuggestion={onSend}
        canSend={!block}
      />
      <PromptComposer
        onSend={onSend}
        block={block}
        remainingTokens={remainingTokens}
        onUpgrade={onUpgrade}
        canUpgrade={canUpgrade}
      />
    </section>
  );
}
