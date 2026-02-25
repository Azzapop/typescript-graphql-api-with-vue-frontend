import { refreshTokens } from '~libs/auth-tokens';
import type { User } from '~libs/domain-model';
import { RefreshTokenStore, UserStore } from '~libs/domain-model';
import { logger } from '~libs/logger';

export const validateRefreshToken = async (
  refreshToken: string
): Promise<User | null> => {
  const result = await refreshTokens.verifyRefreshToken(refreshToken);
  if (!result.success) {
    return null;
  }

  const { data } = result;
  const { sub: userId, refreshTokenId, tokenVersion } = data;
  const userResult = await UserStore.getById(userId);

  if (!userResult.success) {
    logger.error(`Failed to look up user "${userId}" during refresh token validation [${userResult.error}]`);
    return null;
  }

  if (!userResult.data) {
    logger.info(`User "${userId}" from refresh token not found`);
    return null;
  }

  if (userResult.data.tokenVersion !== tokenVersion) {
    logger.info(`Token version mismatch for user "${userId}"`);
    return null;
  }

  const youngestResult = await RefreshTokenStore.findYoungest(userId);

  if (!youngestResult.success) {
    logger.error(`Failed to find youngest refresh token for user "${userId}" [${youngestResult.error}]`);
    return null;
  }

  if (!youngestResult.data || youngestResult.data.id !== refreshTokenId) {
    logger.info(`Replay attack detected for user "${userId}", clearing token family`);
    void RefreshTokenStore.clearTokenFamily(userId);
    return null;
  }

  return userResult.data;
};
