import { GraphQLError } from 'graphql';
import { describe, it, expect } from 'vitest';
import { GqlInternalServerError } from '../internal-server-error';

describe('GqlInternalServerError', () => {
  describe('with default message', () => {
    it('creates an instance of GraphQLError', () => {
      const error = new GqlInternalServerError();
      expect(error).toBeInstanceOf(GraphQLError);
    });

    it('has the default error message', () => {
      const error = new GqlInternalServerError();
      expect(error.message).toBe('Internal server error');
    });

    it('has the correct error code in extensions', () => {
      const error = new GqlInternalServerError();
      expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('with custom message', () => {
    it('uses the provided custom message', () => {
      const customMessage = 'Database connection failed';
      const error = new GqlInternalServerError(customMessage);
      expect(error.message).toBe(customMessage);
    });

    it('still has the correct error code', () => {
      const error = new GqlInternalServerError('Custom error');
      expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });
});
