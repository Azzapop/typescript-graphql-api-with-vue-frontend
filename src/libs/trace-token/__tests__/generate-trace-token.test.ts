import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTraceToken } from '../generate-trace-token';

describe('generateTraceToken', () => {
  describe('when crypto.randomUUID is available', () => {
    const mockRandomUUID = vi.fn();

    beforeEach(() => {
      mockRandomUUID.mockReturnValue('mock-trace-token-123');
      vi.stubGlobal('crypto', { randomUUID: mockRandomUUID });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('uses crypto.randomUUID', () => {
      const token = generateTraceToken();

      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
      expect(token).toBe('mock-trace-token-123');
    });
  });

  describe('when crypto.randomUUID is not available', () => {
    beforeEach(() => {
      vi.stubGlobal('crypto', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('generates a string token', () => {
      const token = generateTraceToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('generates unique tokens', () => {
      const tokens = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        tokens.add(generateTraceToken());
      }

      // All tokens should be unique
      expect(tokens.size).toBe(iterations);
    });
  });
});
