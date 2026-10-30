import { useState } from 'react';
import { PaymentSimulator, paymentSimulator } from '../../services/PaymentSimulator';

const EMPTY_FORM = { cardHolder: '', cardNumber: '', expiry: '', cvc: '' };

function Field({ id, label, error, ...inputProps }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      {error && <p id={`${id}-error`} className="field__error">{error}</p>}
    </div>
  );
}

/**
 * Simulated card form. Validates locally and returns only the data the backend needs.
 */
export function PaymentForm({ priceLabel, isProcessing, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = paymentSimulator.validate(form);
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      onSubmit(form);
    }
  };

  const fillTestCard = () => {
    setForm((current) => ({
      ...current,
      cardNumber: PaymentSimulator.TEST_CARD,
      expiry: current.expiry || '12/30',
      cvc: current.cvc || '123',
    }));
    setErrors({});
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit} noValidate>
      <Field
        id="card-holder"
        label="Titular de la tarjeta"
        autoComplete="off"
        value={form.cardHolder}
        onChange={(e) => update('cardHolder', e.target.value)}
        error={errors.cardHolder}
        autoFocus
      />
      <Field
        id="card-number"
        label="Número de tarjeta"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0000 0000 0000 0000"
        value={form.cardNumber}
        onChange={(e) => update('cardNumber', paymentSimulator.formatCardNumber(e.target.value))}
        error={errors.cardNumber}
      />
      <div className="payment-form__row">
        <Field
          id="card-expiry"
          label="Vencimiento"
          inputMode="numeric"
          autoComplete="off"
          placeholder="MM/AA"
          value={form.expiry}
          onChange={(e) => update('expiry', paymentSimulator.formatExpiry(e.target.value))}
          error={errors.expiry}
        />
        <Field
          id="card-cvc"
          label="CVC"
          inputMode="numeric"
          autoComplete="off"
          placeholder="123"
          maxLength={4}
          value={form.cvc}
          onChange={(e) => update('cvc', e.target.value.replace(/\D/g, ''))}
          error={errors.cvc}
        />
      </div>

      <p className="payment-form__hint">
        Este pago es una simulación: no se hace ningún cobro y solo se envían los últimos 4 dígitos.{' '}
        <button type="button" className="link-button" onClick={fillTestCard}>Usar tarjeta de prueba</button>
      </p>

      <button type="submit" className="button button--pay" disabled={isProcessing}>
        {isProcessing ? 'Procesando pago…' : `Pagar ${priceLabel}`}
      </button>
    </form>
  );
}
