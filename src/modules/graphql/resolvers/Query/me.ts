import {
  GqlBadParseError,
  GqlInternalServerError,
  GqlNotFoundError,
} from '~libs/graphql-errors';
import { transformUserProfile } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';
import { userProfileRepo } from '~libs/repositories';

export const me: GqlQueryResolvers['me'] = async (_parent, _args, context) => {
  const profileResult = await userProfileRepo.getByUserId(context.user.id);
  if (!profileResult.success) {
    throw new GqlInternalServerError();
  }

  if (!profileResult.data) {
    throw new GqlNotFoundError();
  }

  const result = transformUserProfile(profileResult.data);
  if (!result) {
    throw new GqlBadParseError();
  }

  return result;
};
