import { authTokensConfig } from '../auth-tokens-config';

const getAccessSecret = (): Uint8Array => {
  return new TextEncoder().encode(authTokensConfig('JWT_ACCESS_SECRET'));
};

export const ACCESS_SECRET = getAccessSecret();
export const ACCESS_TTL_TIMESPAN = '15m';
export const ACCESS_TTL_SECONDS = 15 * 60 * 1000; // 15 minutes
