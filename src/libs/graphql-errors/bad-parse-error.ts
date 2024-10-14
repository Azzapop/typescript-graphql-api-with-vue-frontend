import { GraphQLError } from 'graphql';

export class GqlBadParseError extends GraphQLError {
  constructor() {
    const msg = 'Failed to correctly parse and transform data';
    super(msg, { extensions: { code: 'BAD_PARSE_ERROR' } });
  }
}
