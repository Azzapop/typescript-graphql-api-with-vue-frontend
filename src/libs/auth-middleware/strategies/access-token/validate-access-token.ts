import { accessTokens } from '~libs/auth-tokens';
import type { User } from '~libs/domain-model';
import { UserStore } from '~libs/domain-model';

export const validateAccessToken = async (
  accessToken: string
): Promise<User | null> => {
  const result = await accessTokens.verifyAccessToken(accessToken);

  if (!result.success) {
    return null;
  }

  const { data } = result;
  const { sub: userId, tokenVersion } = data;
  const userResult = await UserStore.getById(userId);
  if (!userResult.success || !userResult.data) {
    return null;
  }

  if (userResult.data.tokenVersion !== tokenVersion) {
    return null;
  }

  return userResult.data;
};
