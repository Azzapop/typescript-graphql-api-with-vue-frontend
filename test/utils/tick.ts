import { vi } from 'vitest';

/*
 * Advance the fake system clock by the given number of milliseconds.
 *
 * Call vi.useFakeTimers() in your beforeEach and vi.useRealTimers() in
 * afterEach (or vi.restoreAllMocks()). Use this instead of raw
 * vi.setSystemTime() so time manipulation is in one place.
 */
export const tick = (ms: number): void => {
  vi.setSystemTime(new Date(Date.now() + ms));
};
