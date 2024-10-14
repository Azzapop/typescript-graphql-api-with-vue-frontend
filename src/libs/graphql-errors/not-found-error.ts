import { GraphQLError } from 'graphql';

export class GqlNotFoundError extends GraphQLError {
  constructor() {
    const msg = 'Unable to find resource';
    super(msg, { extensions: { code: 'NOT_FOUND_ERROR' } });
  }
}
