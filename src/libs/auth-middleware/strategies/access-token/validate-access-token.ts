import { accessTokens } from '~libs/auth-tokens';
import type { User } from '~libs/domain-model';
import { UserStore } from '~libs/domain-model';
import { logger } from '~libs/logger';

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

  if (!userResult.success) {
    logger.error(
      `Failed to look up user "${userId}" during access token validation [${userResult.error}]`
    );
    return null;
  }

  if (!userResult.data) {
    logger.info(`User "${userId}" from access token not found`);
    return null;
  }

  if (userResult.data.tokenVersion !== tokenVersion) {
    logger.info(`Token version mismatch for user "${userId}"`);
    return null;
  }

  return userResult.data;
};
