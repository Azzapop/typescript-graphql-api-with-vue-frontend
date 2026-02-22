import { GraphQLError } from 'graphql';
import { describe, it, expect } from 'vitest';
import { GqlNotFoundError } from '../not-found-error';

describe('GqlNotFoundError', () => {
  it('creates an instance of GraphQLError', () => {
    const error = new GqlNotFoundError();
    expect(error).toBeInstanceOf(GraphQLError);
  });

  it('has the correct error message', () => {
    const error = new GqlNotFoundError();
    expect(error.message).toBe('Unable to find resource');
  });

  it('has the correct error code in extensions', () => {
    const error = new GqlNotFoundError();
    expect(error.extensions.code).toBe('NOT_FOUND_ERROR');
  });
});
