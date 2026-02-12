import { UserProfileStore } from '~libs/domain-model';
import { GqlBadParseError, GqlNotFoundError } from '~libs/graphql-errors';
import { transformUserProfile } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';

export const me: GqlQueryResolvers['me'] = async (_parent, _args, context) => {
  const profile = await UserProfileStore.getByUserId(context.user.id);
  if (!profile) {
    throw new GqlNotFoundError();
  }
  const result = transformUserProfile(profile);
  if (!result) {
    throw new GqlBadParseError();
  }
  return result;
};
