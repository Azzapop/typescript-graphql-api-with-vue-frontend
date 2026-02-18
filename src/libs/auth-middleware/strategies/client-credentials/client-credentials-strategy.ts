import type { VerifyCallback } from 'passport-custom';
import { Strategy as CustomStrategy } from 'passport-custom';
import { validateAccessToken } from '../access-token/validate-access-token';
import { validateRefreshToken } from '../refresh-token/validate-refresh-token';

/**
 * Client credentials strategy that validates access token, falls back to refresh token.
 * If refresh succeeds, new tokens are issued by handleTokens middleware.
 * Replay attacks on refresh tokens are detected and the token family is cleared in validateRefreshToken.
 */
const verifyClientCredentialsCallback: VerifyCallback = async (req, done) => {
  const { cookies } = req;
  const { access_token: accessToken, refresh_token: refreshToken } = cookies;

  // Try access token first
  const userFromAccess = await validateAccessToken(accessToken);
  if (userFromAccess) {
    return done(null, userFromAccess);
  }

  // Try refresh token since the access token was expired or invalid
  const userFromRefresh = await validateRefreshToken(refreshToken);
  if (!userFromRefresh) {
    return done(null, false);
  }

  req.issueNewTokens = true;
  return done(null, userFromRefresh);
};

export const clientCredentialsStrategy = new CustomStrategy(
  verifyClientCredentialsCallback
);
