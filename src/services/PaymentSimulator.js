/**
 * Simulates a card payment: validates the form locally and waits a moment.
 * No card data leaves the browser; only the last 4 digits are sent to the backend.
 */
export class PaymentSimulator {
  static PROCESSING_TIME_MS = 1500;
  static TEST_CARD = '4242 4242 4242 4242';

  normalizeCardNumber(cardNumber) {
    return cardNumber.replace(/\D/g, '');
  }

  formatCardNumber(value) {
    return this.normalizeCardNumber(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  validate({ cardHolder, cardNumber, expiry, cvc }) {
    const errors = {};
    const digits = this.normalizeCardNumber(cardNumber);

    if (cardHolder.trim().length < 3) {
      errors.cardHolder = 'Escribe el nombre como aparece en la tarjeta.';
    }
    if (digits.length !== 16 || !this.passesLuhn(digits)) {
      errors.cardNumber = 'El número de tarjeta no es válido.';
    }
    if (!this.isValidExpiry(expiry)) {
      errors.expiry = 'Usa una fecha futura con formato MM/AA.';
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      errors.cvc = 'El CVC tiene 3 o 4 dígitos.';
    }
    return errors;
  }

  async process(cardNumber) {
    await new Promise((resolve) => setTimeout(resolve, PaymentSimulator.PROCESSING_TIME_MS));
    return { cardLastFour: this.normalizeCardNumber(cardNumber).slice(-4) };
  }

  passesLuhn(digits) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = Number(digits[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  isValidExpiry(expiry) {
    const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
    if (!match) return false;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return false;
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth >= new Date();
  }
}

export const paymentSimulator = new PaymentSimulator();
