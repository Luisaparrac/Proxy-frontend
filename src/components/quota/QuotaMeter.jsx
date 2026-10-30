import { formatCompact, formatLongDate, formatNumber } from '../../utils/format';

const TICKS = 10;

const levelFor = (percentage) => {
  if (percentage >= 100) return 'empty';
  if (percentage >= 80) return 'low';
  return 'ok';
};

/**
 * Monthly token gauge: tokens used vs available, refreshed after every request.
 */
export function QuotaMeter({ status, onUpgrade }) {
  if (!status) return <section className="meter meter--loading" aria-busy="true" />;

  if (status.unlimitedTokens) {
    return (
      <section className="meter" aria-label="Cuota mensual de tokens">
        <h2 className="meter__title">Tokens del mes</h2>
        <p className="meter__figure">Ilimitados</p>
        <p className="meter__caption">
          Llevas {formatNumber(status.tokensUsed)} tokens este mes. Tu plan no tiene tope.
        </p>
      </section>
    );
  }

  const percentage = Math.min(100, (status.tokensUsed / status.monthlyTokenLimit) * 100);
  const level = levelFor(percentage);
  const canUpgrade = status.plan === 'FREE';

  return (
    <section className={`meter meter--${level}`} aria-label="Cuota mensual de tokens">
      <h2 className="meter__title">Tokens disponibles</h2>
      <p className="meter__figure">
        {formatNumber(status.tokensRemaining)}
        <span className="meter__unit"> de {formatCompact(status.monthlyTokenLimit)}</span>
      </p>

      <div
        className="gauge"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={status.monthlyTokenLimit}
        aria-valuenow={Math.min(status.tokensUsed, status.monthlyTokenLimit)}
        aria-valuetext={`${formatNumber(status.tokensUsed)} tokens usados de ${formatNumber(status.monthlyTokenLimit)}`}
      >
        <div className="gauge__fill" style={{ width: `${percentage}%` }} />
        <div className="gauge__ticks" aria-hidden="true">
          {Array.from({ length: TICKS - 1 }, (_, i) => <span key={i} />)}
        </div>
      </div>

      <div className="gauge__scale" aria-hidden="true">
        <span>0</span>
        <span>{formatCompact(status.monthlyTokenLimit / 2)}</span>
        <span>{formatCompact(status.monthlyTokenLimit)}</span>
      </div>

      <p className="meter__caption">
        Usados: {formatNumber(status.tokensUsed)} ({percentage.toFixed(1)} %). Se reinicia el {formatLongDate(status.resetDate)}.
      </p>

      {level !== 'ok' && canUpgrade && (
        <button type="button" className="button button--upgrade" onClick={onUpgrade}>
          {level === 'empty' ? 'Mejorar a PRO para seguir' : 'Mejorar a PRO'}
        </button>
      )}
    </section>
  );
}
