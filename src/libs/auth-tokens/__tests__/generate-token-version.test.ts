import { describe, it, expect } from 'vitest';
import { generateTokenVersion } from '../generate-token-version';

describe('generateTokenVersion', () => {
  describe('cryptographic security', () => {
    it('generates cryptographically secure UUID v4', () => {
      const version = generateTokenVersion();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is one of 8, 9, a, or b
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(version).toMatch(uuidV4Regex);
    });

    it('generates unique token versions', () => {
      const versions = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        versions.add(generateTokenVersion());
      }

      // All versions should be unique
      // UUID collision probability is astronomically low (1 in 2^122)
      expect(versions.size).toBe(iterations);
    });

    it('generates different values on each call', () => {
      const version1 = generateTokenVersion();
      const version2 = generateTokenVersion();
      const version3 = generateTokenVersion();

      expect(version1).not.toBe(version2);
      expect(version2).not.toBe(version3);
      expect(version1).not.toBe(version3);
    });
  });
});
