import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Technique } from '@prisma/client';
import { createTechnique } from '#test/prisma';
import { logger } from '~libs/logger';
import { transformTechnique } from '../transform-technique';

describe('transformTechnique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with valid input', () => {
    it('transforms a prisma technique to graphql technique', () => {
      const prismaTechnique = createTechnique();

      const result = transformTechnique(prismaTechnique);

      expect(result).toEqual({
        id: prismaTechnique.id,
        name: prismaTechnique.name,
      });
    });

    it('does not include prisma-only fields in output', () => {
      const prismaTechnique = createTechnique();

      const result = transformTechnique(prismaTechnique);

      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
    });

    it('does not log errors on success', () => {
      const prismaTechnique = createTechnique();

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
      const { id: _id, ...techniqueWithoutId } = createTechnique();
      const invalidTechnique = techniqueWithoutId as Technique;

      const result = transformTechnique(invalidTechnique);

      expect(result).toBeNull();
    });

    it('returns null when name is missing', () => {
      const { name: _name, ...techniqueWithoutName } = createTechnique();
      const invalidTechnique = techniqueWithoutName as Technique;

      const result = transformTechnique(invalidTechnique);

      expect(result).toBeNull();
    });

    it('logs error message on validation failure', () => {
      const invalidTechnique = { id: 'invalid-id' } as Technique;

      transformTechnique(invalidTechnique);

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to transform technique.'
      );
      expect(logger.error).toHaveBeenCalledTimes(2); // Error message + details
    });
  });
});
