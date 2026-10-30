/**
 * Base URL of the backend. Set VITE_API_URL in Vercel (e.g. https://my-api.up.railway.app).
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
