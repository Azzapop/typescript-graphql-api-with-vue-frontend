import type { VerifyCallback } from 'passport-custom';
import { Strategy as CustomStrategy } from 'passport-custom';
import { accessTokens } from '~libs/auth-tokens';
import { UserStore } from '~libs/domain-model';

const verifyAccessTokenCallback: VerifyCallback = async (req, done) => {
  const {
    cookies: { access_token: accessToken },
  } = req;

  const payload = await accessTokens.verifyAccessToken(accessToken);
  if (!payload) {
    // Invalid token
    done(null, false);
    return;
  }

  const { sub: userId, tokenVersion } = payload;
  const user = await UserStore.getById(userId);
  if (!user || user.tokenVersion !== tokenVersion) {
    // No user, or user's tokens have been revoked
    done(null, false);
  }

  done(null, user);
};

export const accessTokenStrategy = new CustomStrategy(
  verifyAccessTokenCallback
);
