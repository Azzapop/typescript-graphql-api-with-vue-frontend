import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTraceToken } from '../generate-trace-token';

describe('generateTraceToken', () => {
  describe('when crypto.randomUUID is available', () => {
    const mockRandomUUID = vi.fn();

    beforeEach(() => {
      mockRandomUUID.mockReturnValue('550e8400-e29b-41d4-a716-446655440000');
      vi.stubGlobal('crypto', { randomUUID: mockRandomUUID });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('uses crypto.randomUUID to generate token', () => {
      const token = generateTraceToken();

      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
      expect(token).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('returns a valid UUID format', () => {
      mockRandomUUID.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');

      const token = generateTraceToken();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      expect(token).toMatch(uuidRegex);
    });
  });

  describe('when crypto.randomUUID is not available', () => {
    beforeEach(() => {
      vi.stubGlobal('crypto', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('generates a UUID v4 format string using fallback', () => {
      const token = generateTraceToken();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // The '4' indicates version 4
      // The 'y' must be one of [8, 9, a, b]
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(token).toMatch(uuidV4Regex);
    });

    it('has correct version indicator (4) in the right position', () => {
      const token = generateTraceToken();
      const parts = token.split('-');

      // Third segment should start with '4'
      expect(parts[2][0]).toBe('4');
    });

    it('has correct variant bits in the right position', () => {
      const token = generateTraceToken();
      const parts = token.split('-');

      // Fourth segment should start with 8, 9, a, or b
      expect(['8', '9', 'a', 'b']).toContain(parts[3][0].toLowerCase());
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

    it('generates tokens of correct length', () => {
      const token = generateTraceToken();

      // UUID format: 8-4-4-4-12 = 36 characters including hyphens
      expect(token.length).toBe(36);
    });
  });

  describe('format consistency', () => {
    it('always returns string with 4 hyphens at correct positions', () => {
      const token = generateTraceToken();
      const parts = token.split('-');

      expect(parts).toHaveLength(5);
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[3]).toHaveLength(4);
      expect(parts[4]).toHaveLength(12);
    });

    it('only contains hexadecimal characters and hyphens', () => {
      const token = generateTraceToken();
      const hexWithHyphensRegex = /^[0-9a-f-]+$/i;

      expect(token).toMatch(hexWithHyphensRegex);
    });
  });
});
