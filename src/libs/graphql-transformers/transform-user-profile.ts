import type { UserProfile } from '~libs/domain-model';
import type { GqlUserProfile } from '~libs/graphql-types';

export const transformUserProfile = (
  profile: UserProfile
): GqlUserProfile | null => {
  return {
    id: profile.id,
    email: profile.email ?? null,
  };
};
