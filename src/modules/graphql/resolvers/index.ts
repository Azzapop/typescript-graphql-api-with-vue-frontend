import type { GqlResolvers } from '~libs/graphql-types';
import { Query } from './Query';
import { UserProfile } from './UserProfile';

export const resolvers: GqlResolvers = {
  Query,
  UserProfile,
};
