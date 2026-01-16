export const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);
export const REFRESH_TTL_TIMESPAN = '7d';
export const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days
