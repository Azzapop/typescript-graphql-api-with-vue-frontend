import type { User } from '~libs/domain-model';
import { RefreshTokenStore } from '~libs/domain-model';
import { signAccessToken } from './access-tokens';
import { signRefreshToken } from './refresh-tokens';

export const issueTokens = async (
  user: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await signAccessToken(user);
  const refreshTokenRecord = await RefreshTokenStore.createToken(user);
  const refreshToken = await signRefreshToken(user, refreshTokenRecord);

  return { accessToken, refreshToken };
};
