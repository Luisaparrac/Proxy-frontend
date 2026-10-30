import { useCallback, useEffect, useRef, useState } from 'react';
import { quotaService } from '../services/QuotaService';

/**
 * Quota status and 7-day history of a user.
 * rateResetAt is the moment (ms) when the per-minute counter resets on the server.
 */
export function useQuota(userId) {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [rateResetAt, setRateResetAt] = useState(null);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const requestId = ++latestRequest.current;
    try {
      const [nextStatus, nextHistory] = await Promise.all([
        quotaService.getStatus(userId),
        quotaService.getHistory(userId),
      ]);
      if (requestId !== latestRequest.current) return;
      setStatus(nextStatus);
      setHistory(nextHistory);
      setRateResetAt(Date.now() + nextStatus.secondsUntilRateLimitReset * 1000);
      setError(null);
    } catch (e) {
      if (requestId === latestRequest.current) setError(e);
    }
  }, [userId]);

  useEffect(() => {
    setStatus(null);
    setHistory([]);
    setRateResetAt(null);
    refresh();
  }, [refresh]);

  return { status, history, rateResetAt, error, refresh };
}
