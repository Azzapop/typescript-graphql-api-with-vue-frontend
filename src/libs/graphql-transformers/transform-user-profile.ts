import type { UserProfile } from '@prisma/client';
import type { GqlResolversTypes } from '~libs/graphql-types';

export const transformUserProfile = (
  profile: UserProfile
): GqlResolversTypes['UserProfile'] | null => {
  return {
    id: profile.id,
    email: profile.email ?? null,
  };
};
