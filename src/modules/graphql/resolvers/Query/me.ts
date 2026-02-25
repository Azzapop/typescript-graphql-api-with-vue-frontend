import { UserProfileStore } from '~libs/domain-model';
import {
  GqlBadParseError,
  GqlInternalServerError,
  GqlNotFoundError,
} from '~libs/graphql-errors';
import { transformUserProfile } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';

export const me: GqlQueryResolvers['me'] = async (_parent, _args, context) => {
  const profileResult = await UserProfileStore.getByUserId(context.user.id);
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
