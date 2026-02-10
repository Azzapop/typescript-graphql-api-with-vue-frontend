import { vi } from 'vitest';

// Mock the logger for all unit tests to avoid console output
vi.mock('~libs/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
  },
}));
