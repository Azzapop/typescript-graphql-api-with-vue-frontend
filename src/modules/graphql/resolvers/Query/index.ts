import type { GqlQueryResolvers } from '~libs/graphql-types';
import { me } from './me';
import { testError } from './test-error';

export const Query: GqlQueryResolvers = {
  me,
  testError,
};
