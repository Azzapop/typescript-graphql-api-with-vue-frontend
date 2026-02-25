import { refreshTokens } from '~libs/auth-tokens';
import type { User } from '~libs/domain-model';
import { RefreshTokenStore, UserStore } from '~libs/domain-model';

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
  if (!userResult.success || !userResult.data) {
    return null;
  }

  if (userResult.data.tokenVersion !== tokenVersion) {
    return null;
  }

  const youngestResult = await RefreshTokenStore.findYoungest(userId);
  if (!youngestResult.success || !youngestResult.data || youngestResult.data.id !== refreshTokenId) {
    // Replay attack detected - an old refresh token is being reused, clear the entire family
    void RefreshTokenStore.clearTokenFamily(userId);
    return null;
  }

  return userResult.data;
};
