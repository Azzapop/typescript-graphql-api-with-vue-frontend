import type { UserProfile } from '@prisma/client';
import type { GqlResolversTypes } from '~libs/graphql-types';
import { logger } from '~libs/logger';
import { UserProfileSchema } from '~libs/prisma-validators';

const PRISMA_TO_GQL = UserProfileSchema.transform(
  ({ id, email }): GqlResolversTypes['UserProfile'] => ({
    id,
    email: email ?? null,
  })
);

export const transformUserProfile = (
  profile: UserProfile | null
): GqlResolversTypes['UserProfile'] | null => {
  const result = PRISMA_TO_GQL.safeParse(profile);
  if (result.success) {
    return result.data;
  } else {
    logger.request.error('Failed to transform user profile.');
    logger.request.error(result.error.message);
    return null;
  }
};
