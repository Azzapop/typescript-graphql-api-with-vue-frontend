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
  const user = await UserStore.getById(userId);
  if (!user || user.tokenVersion !== tokenVersion) {
    return null;
  }

  const youngestRefreshToken = await RefreshTokenStore.findYoungest(userId);
  if (!youngestRefreshToken || youngestRefreshToken.id !== refreshTokenId) {
    // Replay attack detected - an old refresh token is being reused, clear the entire family
    RefreshTokenStore.clearTokenFamily(userId);
    return null;
  }

  return user;
};
