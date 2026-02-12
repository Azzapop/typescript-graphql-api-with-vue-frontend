import type { VerifyCallback } from 'passport-custom';
import { Strategy as CustomStrategy } from 'passport-custom';
import { validateAccessToken } from './validate-access-token';

const verifyAccessTokenCallback: VerifyCallback = async (req, done) => {
  const {
    cookies: { access_token: accessToken },
  } = req;

  if (!accessToken) {
    return done(null, false);
  }

  const user = await validateAccessToken(accessToken);
  if (!user) {
    return done(null, false);
  }

  done(null, user);
};

export const accessTokenStrategy = new CustomStrategy(
  verifyAccessTokenCallback
);
