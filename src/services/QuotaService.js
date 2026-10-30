import { apiClient } from './ApiClient';

/**
 * Reads quota status and history, and requests plan upgrades.
 */
export class QuotaService {
  constructor(client = apiClient) {
    this.client = client;
  }

  getStatus(userId) {
    return this.client.get('/api/quota/status', userId);
  }

  getHistory(userId) {
    return this.client.get('/api/quota/history', userId);
  }

  upgrade(userId, { targetPlan, cardHolder, cardLastFour }) {
    return this.client.post('/api/quota/upgrade', { targetPlan, cardHolder, cardLastFour }, userId);
  }
}

export const quotaService = new QuotaService();
