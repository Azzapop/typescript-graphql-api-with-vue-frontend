import { GraphQLError } from 'graphql';

export class GqlInternalServerError extends GraphQLError {
  constructor(message?: string) {
    const msg = message ?? 'Internal server error';
    super(msg, { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
}
