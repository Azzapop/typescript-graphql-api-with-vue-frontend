import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Technique } from '@prisma/client';
import { transformTechnique } from '../transform-technique';

// Mock the logger to avoid console output and verify error logging
vi.mock('~libs/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
  },
}));

// Import after mocking
import { logger } from '~libs/logger';

const createValidTechnique = (overrides?: Partial<Technique>): Technique => ({
  id: 'clh1234567890',
  name: 'Oil Painting',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

describe('transformTechnique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with valid input', () => {
    it('transforms a prisma technique to graphql technique', () => {
      const prismaTechnique = createValidTechnique();

      const result = transformTechnique(prismaTechnique);

      expect(result).toEqual({
        id: 'clh1234567890',
        name: 'Oil Painting',
      });
    });

    it('does not include prisma-only fields in output', () => {
      const prismaTechnique = createValidTechnique();

      const result = transformTechnique(prismaTechnique);

      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
    });

    it('does not log errors on success', () => {
      const prismaTechnique = createValidTechnique();

      transformTechnique(prismaTechnique);

      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe('with null input', () => {
    it('returns null', () => {
      const result = transformTechnique(null);

      expect(result).toBeNull();
    });

    it('logs an error', () => {
      transformTechnique(null);

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('with invalid input', () => {
    it('returns null when id is missing', () => {
      const invalidTechnique = {
        name: 'Oil Painting',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Technique;

      const result = transformTechnique(invalidTechnique);

      expect(result).toBeNull();
    });

    it('returns null when name is missing', () => {
      const invalidTechnique = {
        id: 'clh1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Technique;

      const result = transformTechnique(invalidTechnique);

      expect(result).toBeNull();
    });

    it('logs error message on validation failure', () => {
      const invalidTechnique = { id: 'test' } as Technique;

      transformTechnique(invalidTechnique);

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to transform technique.'
      );
      expect(logger.error).toHaveBeenCalledTimes(2); // Error message + details
    });
  });
});
