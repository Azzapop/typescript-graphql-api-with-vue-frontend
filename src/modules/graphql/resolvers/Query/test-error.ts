import { GqlInternalServerError } from '~libs/graphql-errors';
import type { GqlResolvers } from '~libs/graphql-types';

export const testError: GqlResolvers['Query']['testError'] = async () => {
  // Add delay so loading page shows briefly before error
  await new Promise((resolve) => setTimeout(resolve, 5000));
  throw new GqlInternalServerError('This is a test error');
};
