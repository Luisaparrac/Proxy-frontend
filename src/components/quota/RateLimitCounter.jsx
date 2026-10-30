import { formatSeconds } from '../../utils/format';

/**
 * Requests made in the current minute and countdown until the counter resets.
 */
export function RateLimitCounter({ status, secondsToReset }) {
  if (!status) return null;

  const used = status.requestsUsedThisMinute;
  const limit = status.requestsPerMinuteLimit;
  const isFull = !status.unlimitedRequests && used >= limit;

  return (
    <section className={`rate ${isFull ? 'rate--full' : ''}`} aria-label="Solicitudes por minuto">
      <div className="rate__row">
        <h2 className="rate__title">Solicitudes este minuto</h2>
        <p className="rate__count">
          {used}
          <span className="rate__limit">{status.unlimitedRequests ? ' / sin límite' : ` / ${limit}`}</span>
        </p>
      </div>

      {!status.unlimitedRequests && (
        <div className="rate__pips" aria-hidden="true">
          {Array.from({ length: Math.min(limit, 60) }, (_, i) => (
            <span key={i} className={i < used ? 'is-used' : ''} />
          ))}
        </div>
      )}

      <p className="rate__reset" aria-live="polite">
        El contador se reinicia en <strong>{formatSeconds(secondsToReset)}</strong>
      </p>
    </section>
  );
}
