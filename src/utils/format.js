const LOCALE = 'es-CO';

const numberFormatter = new Intl.NumberFormat(LOCALE);
const compactFormatter = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });

export const formatNumber = (value) => numberFormatter.format(value ?? 0);

export const formatCompact = (value) => compactFormatter.format(value ?? 0);

/** Parses "2026-11-01" as a local date (avoids the UTC shift of new Date(string)). */
export const parseLocalDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatLongDate = (isoDate) =>
  parseLocalDate(isoDate).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' });

export const formatShortDay = (isoDate) =>
  parseLocalDate(isoDate).toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric' });

export const formatTime = (date) =>
  date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });

export const formatSeconds = (seconds) => `${Math.max(0, seconds)} s`;
