import type { User } from '@prisma/client';
import { logger } from '~libs/logger';
import { refreshTokenRepo } from '~libs/repositories';
import type { Result } from '~libs/result';
import { signAccessToken } from './access-tokens';
import { signRefreshToken } from './refresh-tokens';

type IssueTokensError = 'UNABLE_TO_CREATE_REFRESH_TOKEN';

export const issueTokens = async (
  user: User
): Promise<
  Result<{ accessToken: string; refreshToken: string }, IssueTokensError>
> => {
  const accessToken = await signAccessToken(user);
  const refreshTokenResult = await refreshTokenRepo.createToken(user);

  if (!refreshTokenResult.success) {
    logger.error(
      `Failed to issue tokens for userId "${user.id}" [${refreshTokenResult.error}]`
    );
    return { success: false, error: 'UNABLE_TO_CREATE_REFRESH_TOKEN' };
  }

  const refreshToken = await signRefreshToken(user, refreshTokenResult.data);

  return { success: true, data: { accessToken, refreshToken } };
};
