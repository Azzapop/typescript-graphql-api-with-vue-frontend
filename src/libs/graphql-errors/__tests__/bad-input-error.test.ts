import { GraphQLError } from 'graphql';
import { describe, it, expect } from 'vitest';
import { GqlBadInputError } from '../bad-input-error';

describe('GqlBadInputError', () => {
  it('creates an instance of GraphQLError', () => {
    const error = new GqlBadInputError();
    expect(error).toBeInstanceOf(GraphQLError);
  });

  it('has the correct error message', () => {
    const error = new GqlBadInputError();
    expect(error.message).toBe('Failed to correctly parse input data');
  });

  it('has error code in extensions', () => {
    const error = new GqlBadInputError();
    expect(error.extensions).toHaveProperty('code');
  });
});
