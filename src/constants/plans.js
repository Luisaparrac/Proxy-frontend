/**
 * Display data for each plan. Limits mirror the backend Plan enum.
 */
export const PLANS = {
  FREE: { label: 'Free', requestsPerMinute: 10, monthlyTokens: 50_000, priceUsd: 0 },
  PRO: { label: 'Pro', requestsPerMinute: 60, monthlyTokens: 500_000, priceUsd: 19.99 },
  ENTERPRISE: { label: 'Enterprise', requestsPerMinute: null, monthlyTokens: null, priceUsd: 99.99 },
};

export const UPGRADE_TARGET = 'PRO';
