/**
 * Error returned by the backend, with the HTTP status and Retry-After when present.
 */
export class ApiError extends Error {
  constructor(status, code, message, retryAfterSeconds = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  get isRateLimited() {
    return this.status === 429;
  }

  get isQuotaExceeded() {
    return this.status === 402;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}
