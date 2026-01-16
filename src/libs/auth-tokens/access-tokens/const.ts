export const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!
);
export const ACCESS_TTL_TIMESPAN = '15m';
export const ACCESS_TTL_SECONDS = 15 * 60 * 1000; // 15 minutes
