const DEFAULT_API_URL = 'http://localhost:8080';

/**
 * Normalizes the configured URL: adds https:// when the protocol is missing
 * (otherwise the browser treats it as a relative path) and removes the trailing slash.
 */
const normalizeUrl = (value) => {
  const url = value.trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

/**
 * Base URL of the backend. Set VITE_API_URL in Vercel (e.g. https://my-api.up.railway.app).
 */
export const API_URL = normalizeUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);
