import { GraphQLError } from 'graphql';
import { describe, it, expect } from 'vitest';
import { GqlBadParseError } from '../bad-parse-error';

describe('GqlBadParseError', () => {
  it('creates an instance of GraphQLError', () => {
    const error = new GqlBadParseError();
    expect(error).toBeInstanceOf(GraphQLError);
  });

  it('has the correct error message', () => {
    const error = new GqlBadParseError();
    expect(error.message).toBe('Failed to correctly parse and transform data');
  });

  it('has the correct error code in extensions', () => {
    const error = new GqlBadParseError();
    expect(error.extensions.code).toBe('BAD_PARSE_ERROR');
  });
});
