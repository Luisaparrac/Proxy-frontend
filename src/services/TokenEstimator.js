/**
 * Estimates tokens with the same rule as the backend: about 4 characters per token.
 * The mock service answers with short paragraphs, so a fixed response estimate is added.
 */
export class TokenEstimator {
  static CHARACTERS_PER_TOKEN = 4;
  static ESTIMATED_RESPONSE_TOKENS = 50;

  estimatePrompt(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return Math.ceil(trimmed.length / TokenEstimator.CHARACTERS_PER_TOKEN);
  }

  estimateTotal(text) {
    const promptTokens = this.estimatePrompt(text);
    if (promptTokens === 0) return { promptTokens: 0, responseTokens: 0, total: 0 };
    const responseTokens = TokenEstimator.ESTIMATED_RESPONSE_TOKENS;
    return { promptTokens, responseTokens, total: promptTokens + responseTokens };
  }
}

export const tokenEstimator = new TokenEstimator();
