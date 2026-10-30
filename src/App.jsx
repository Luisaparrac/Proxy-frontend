import { useCallback, useEffect, useRef, useState } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { ConnectionError } from './components/layout/ConnectionError';
import { ChatPanel } from './components/chat/ChatPanel';
import { QuotaMeter } from './components/quota/QuotaMeter';
import { RateLimitCounter } from './components/quota/RateLimitCounter';
import { UsageHistoryChart } from './components/quota/UsageHistoryChart';
import { UpgradeModal } from './components/upgrade/UpgradeModal';
import { useUsers } from './hooks/useUsers';
import { useQuota } from './hooks/useQuota';
import { useChat } from './hooks/useChat';
import { useNow } from './hooks/useNow';

const DEFAULT_RETRY_SECONDS = 5;
const RESET_REFRESH_DELAY_MS = 400;

const secondsUntil = (timestamp, now) => Math.max(0, Math.ceil((timestamp - now) / 1000));

export default function App() {
  const now = useNow();
  const { users, selectedUserId, selectUser, error: usersError, reload: reloadUsers } = useUsers();
  const { status, history, rateResetAt, refresh } = useQuota(selectedUserId);

  const [retryUntil, setRetryUntil] = useState(0);
  const [upgrade, setUpgrade] = useState({ open: false, reason: 'manual' });

  const statusRef = useRef(status);
  statusRef.current = status;

  const handleRateLimited = useCallback((retryAfterSeconds) => {
    setRetryUntil(Date.now() + (retryAfterSeconds ?? DEFAULT_RETRY_SECONDS) * 1000);
  }, []);

  const handleQuotaExceeded = useCallback(() => {
    if (statusRef.current?.plan === 'FREE') {
      setUpgrade({ open: true, reason: 'quota' });
    }
  }, []);

  const { messages, isSending, isWaitingReply, send } = useChat(selectedUserId, {
    onSettled: refresh,
    onRateLimited: handleRateLimited,
    onQuotaExceeded: handleQuotaExceeded,
  });

  // Tracks whether the upgrade modal was already shown automatically for the current selection.
  const autoUpgradeShownFor = useRef(null);

  useEffect(() => {
    setRetryUntil(0);
    setUpgrade({ open: false, reason: 'manual' });
    autoUpgradeShownFor.current = null;
  }, [selectedUserId]);

  // A FREE user selected with no tokens left sees the upgrade modal right away.
  useEffect(() => {
    if (!status || status.userId !== selectedUserId) return;
    const quotaExhausted = status.plan === 'FREE' && !status.unlimitedTokens && status.tokensRemaining <= 0;
    if (quotaExhausted && autoUpgradeShownFor.current !== selectedUserId) {
      autoUpgradeShownFor.current = selectedUserId;
      setUpgrade({ open: true, reason: 'quota' });
    }
  }, [status, selectedUserId]);

  // When the per-minute window ends on the server, read the fresh counters.
  const lastResetRefresh = useRef(null);
  useEffect(() => {
    if (rateResetAt && now >= rateResetAt + RESET_REFRESH_DELAY_MS && lastResetRefresh.current !== rateResetAt) {
      lastResetRefresh.current = rateResetAt;
      refresh();
    }
  }, [now, rateResetAt, refresh]);

  const handleUpgraded = useCallback(() => {
    setRetryUntil(0);
    refresh();
    reloadUsers();
  }, [refresh, reloadUsers]);

  const openUpgrade = useCallback(() => setUpgrade({ open: true, reason: 'manual' }), []);
  const closeUpgrade = useCallback(() => setUpgrade((current) => ({ ...current, open: false })), []);

  if (usersError && !users.length) {
    return <ConnectionError message={usersError.message} onRetry={reloadUsers} />;
  }

  const secondsToReset = rateResetAt ? secondsUntil(rateResetAt, now) : 0;
  const minuteIsFull = Boolean(status)
    && !status.unlimitedRequests
    && status.requestsUsedThisMinute >= status.requestsPerMinuteLimit;
  const rateBlockedUntil = Math.max(retryUntil, minuteIsFull && rateResetAt ? rateResetAt : 0);
  const rateBlockSeconds = secondsUntil(rateBlockedUntil, now);
  const quotaIsEmpty = Boolean(status) && !status.unlimitedTokens && status.tokensRemaining <= 0;

  let block = null;
  if (isSending) block = { type: 'sending' };
  else if (quotaIsEmpty) block = { type: 'quota' };
  else if (rateBlockSeconds > 0) block = { type: 'rate', seconds: rateBlockSeconds };

  const canUpgrade = status?.plan === 'FREE';

  return (
    <div className="app">
      <AppHeader
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={selectUser}
        plan={status?.plan}
      />

      <main className="workspace">
        <ChatPanel
          messages={messages}
          isWaitingReply={isWaitingReply}
          block={block}
          remainingTokens={status && !status.unlimitedTokens ? status.tokensRemaining : null}
          onSend={send}
          onUpgrade={openUpgrade}
          canUpgrade={canUpgrade}
        />

        <aside className="meters" aria-label="Estado de tu cuota">
          <QuotaMeter status={status} onUpgrade={openUpgrade} />
          <RateLimitCounter status={status} secondsToReset={secondsToReset} />
          <UsageHistoryChart history={history} />
        </aside>
      </main>

      <UpgradeModal
        open={upgrade.open}
        reason={upgrade.reason}
        userId={selectedUserId}
        onClose={closeUpgrade}
        onUpgraded={handleUpgraded}
      />
    </div>
  );
}
