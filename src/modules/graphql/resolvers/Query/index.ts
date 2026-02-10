import type { GqlQueryResolvers } from '~libs/graphql-types';
import { me } from './me';

export const Query: GqlQueryResolvers = {
  me,
};
