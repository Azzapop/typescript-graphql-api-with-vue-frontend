import type { VerifyCallback } from 'passport-custom';
import { Strategy as CustomStrategy } from 'passport-custom';
import { validateRefreshToken } from './validate-refresh-token';

const verifyRefreshTokenCallback: VerifyCallback = async (req, done) => {
  try {
    const {
      cookies: { refresh_token: refreshToken },
    } = req;

    if (!refreshToken) {
      return done(null, false);
    }

    const user = await validateRefreshToken(refreshToken);

    if (!user) {
      return done(null, false);
    }

    req.issueNewTokens = true;
    done(null, user);
  } catch (err) {
    done(err);
  }
};

export const refreshTokenStrategy = new CustomStrategy(
  verifyRefreshTokenCallback
);
