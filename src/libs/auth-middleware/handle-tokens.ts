import type { Handler } from 'express';
import { accessTokens, issueTokens, refreshTokens } from '~libs/auth-tokens';
import { logger } from '~libs/logger';
import { authMiddlewareConfig } from './auth-middleware-config';

export const handleTokens = (): Handler => async (req, res, next) => {
  const { issueNewTokens, user } = req;

  if (!user) {
    // We haven't got a user, so we're not authenicated, clear the cookies and continue
    res.clearCookie('access_token').clearCookie('refresh_token');
    return next();
  }

  if (issueNewTokens) {
    const tokensResult = await issueTokens(user);

    if (!tokensResult.success) {
      logger.error(`Failed to issue tokens for user "${user.id}" [${tokensResult.error}]`);
      res.clearCookie('access_token').clearCookie('refresh_token');
      return next();
    }

    const { data: { accessToken, refreshToken } } = tokensResult;
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: authMiddlewareConfig('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: accessTokens.ACCESS_TTL_SECONDS,
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: authMiddlewareConfig('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: refreshTokens.REFRESH_TTL_SECONDS,
      });

    return next();
  }

  next();
};
