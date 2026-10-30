import { apiClient } from './ApiClient';

/**
 * Sends prompts to the generation endpoint (which goes through the proxy chain).
 */
export class AIService {
  constructor(client = apiClient) {
    this.client = client;
  }

  generate(userId, prompt) {
    return this.client.post('/api/ai/generate', { prompt }, userId);
  }
}

export const aiService = new AIService();
