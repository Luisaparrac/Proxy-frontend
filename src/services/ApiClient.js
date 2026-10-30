import { API_URL } from '../config/env';
import { ApiError } from './ApiError';

const USER_HEADER = 'X-User-Id';
const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Verifica que el backend esté activo e intenta de nuevo.';

/**
 * Thin HTTP client: sends JSON, adds the user header and turns error responses into ApiError.
 */
export class ApiClient {
  constructor(baseUrl = API_URL) {
    this.baseUrl = baseUrl;
  }

  get(path, userId) {
    return this.request('GET', path, userId);
  }

  post(path, body, userId) {
    return this.request('POST', path, userId, body);
  }

  async request(method, path, userId, body) {
    const headers = { Accept: 'application/json' };
    if (userId) headers[USER_HEADER] = userId;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    let response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiError(0, 'NETWORK_ERROR', NETWORK_ERROR_MESSAGE);
    }

    const data = await this.parseJson(response);
    if (!response.ok) {
      throw this.toApiError(response, data);
    }
    return data;
  }

  async parseJson(response) {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  toApiError(response, data) {
    const headerValue = Number(response.headers.get('Retry-After'));
    const retryAfter = Number.isFinite(headerValue) && headerValue > 0
      ? headerValue
      : data?.retryAfterSeconds ?? null;

    return new ApiError(
      response.status,
      data?.error ?? 'HTTP_ERROR',
      data?.message ?? `El servidor respondió con el código ${response.status}.`,
      retryAfter,
    );
  }
}

export const apiClient = new ApiClient();
