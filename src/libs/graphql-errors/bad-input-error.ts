import { GraphQLError } from 'graphql';

export class GqlBadInputError extends GraphQLError {
  // TODO details of the bad input args
  constructor() {
    const msg = 'Failed to correctly parse input data';
    super(msg, { extensions: { code: 'NOT_FOUND_ERROR' } });
  }
}
