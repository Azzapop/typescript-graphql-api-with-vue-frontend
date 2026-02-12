import type { GqlUserProfileResolvers } from '~libs/graphql-types';

export const UserProfile: GqlUserProfileResolvers = {
  id: (parent) => parent.id,
  email: (parent) => parent.email,
};
