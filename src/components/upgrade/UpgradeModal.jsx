import { useEffect, useState } from 'react';
import { PLANS, UPGRADE_TARGET } from '../../constants/plans';
import { paymentSimulator } from '../../services/PaymentSimulator';
import { quotaService } from '../../services/QuotaService';
import { PlanComparison } from './PlanComparison';
import { PaymentForm } from './PaymentForm';

/**
 * Upgrade modal (FREE → PRO) with simulated payment.
 * Opens automatically when the backend answers 402.
 */
export function UpgradeModal({ open, reason, userId, onClose, onUpgraded }) {
  const [step, setStep] = useState('form');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      setStep('form');
      setError(null);
      setResult(null);
    }
  }, [open, userId]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape' && step !== 'processing') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, step, onClose]);

  if (!open) return null;

  const priceLabel = `USD ${PLANS.PRO.priceUsd.toFixed(2)}`;

  const handlePayment = async (form) => {
    setStep('processing');
    setError(null);
    try {
      const { cardLastFour } = await paymentSimulator.process(form.cardNumber);
      const response = await quotaService.upgrade(userId, {
        targetPlan: UPGRADE_TARGET,
        cardHolder: form.cardHolder.trim(),
        cardLastFour,
      });
      setResult(response);
      setStep('success');
      onUpgraded(response);
    } catch (e) {
      setError(e.message);
      setStep('form');
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
        {step === 'success' ? (
          <div className="modal__success">
            <h2 id="upgrade-title" className="modal__title">Ya tienes el plan PRO</h2>
            <p>{result.message}</p>
            <p className="modal__muted">Comprobante de la simulación: {result.transactionId}</p>
            <button type="button" className="button button--send" onClick={onClose} autoFocus>
              Seguir chateando
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="modal__close" onClick={onClose} disabled={step === 'processing'} aria-label="Cerrar">
              ×
            </button>
            <h2 id="upgrade-title" className="modal__title">Mejora a PRO</h2>
            <p className="modal__lead">
              {reason === 'quota'
                ? 'Agotaste los tokens de tu plan FREE este mes. Con PRO tienes 10 veces más tokens y 6 veces más solicitudes por minuto.'
                : 'Con PRO tienes 10 veces más tokens y 6 veces más solicitudes por minuto.'}
            </p>
            <PlanComparison />
            {error && <p className="modal__error" role="alert">{error}</p>}
            <PaymentForm priceLabel={priceLabel} isProcessing={step === 'processing'} onSubmit={handlePayment} />
          </>
        )}
      </div>
    </div>
  );
}
