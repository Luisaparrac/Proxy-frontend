import { useCallback, useState } from 'react';
import { aiService } from '../services/AIService';

let messageSequence = 0;
const createMessage = (fields) => ({ id: ++messageSequence, createdAt: new Date(), ...fields });

/**
 * Chat conversation per user. Each user keeps its own messages when switching.
 * Callbacks let the page react to 429, 402 and to every finished request.
 */
export function useChat(userId, { onSettled, onRateLimited, onQuotaExceeded } = {}) {
  const [messagesByUser, setMessagesByUser] = useState({});
  const [pendingUserId, setPendingUserId] = useState(null);

  const append = useCallback((targetUserId, message) => {
    setMessagesByUser((current) => ({
      ...current,
      [targetUserId]: [...(current[targetUserId] ?? []), message],
    }));
  }, []);

  const send = useCallback(async (prompt) => {
    const targetUserId = userId;
    if (!targetUserId || pendingUserId) return;

    append(targetUserId, createMessage({ role: 'user', text: prompt }));
    setPendingUserId(targetUserId);

    try {
      const response = await aiService.generate(targetUserId, prompt);
      append(targetUserId, createMessage({
        role: 'assistant',
        text: response.text,
        tokens: response.totalTokens,
        latencyMs: response.latencyMs,
      }));
    } catch (error) {
      append(targetUserId, createMessage({ role: 'notice', status: error.status, text: error.message }));
      if (error.isRateLimited) onRateLimited?.(error.retryAfterSeconds);
      if (error.isQuotaExceeded) onQuotaExceeded?.();
    } finally {
      setPendingUserId(null);
      onSettled?.();
    }
  }, [userId, pendingUserId, append, onSettled, onRateLimited, onQuotaExceeded]);

  return {
    messages: messagesByUser[userId] ?? [],
    isSending: pendingUserId !== null,
    isWaitingReply: pendingUserId === userId,
    send,
  };
}
