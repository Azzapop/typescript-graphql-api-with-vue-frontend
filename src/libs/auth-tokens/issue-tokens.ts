import type { User } from '~libs/domain-model';
import { RefreshTokenStore } from '~libs/domain-model';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { signAccessToken } from './access-tokens';
import { signRefreshToken } from './refresh-tokens';

type IssueTokensError = 'UNEXPECTED_ERROR';

export const issueTokens = async (
  user: User
): Promise<Result<{ accessToken: string; refreshToken: string }, IssueTokensError>> => {
  const accessToken = await signAccessToken(user);
  const refreshTokenResult = await RefreshTokenStore.createToken(user);

  if (!refreshTokenResult.success) {
    logger.error(`Failed to issue tokens for userId "${user.id}" [${refreshTokenResult.error}]`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }

  const refreshToken = await signRefreshToken(user, refreshTokenResult.data);

  return { success: true, data: { accessToken, refreshToken } };
};
