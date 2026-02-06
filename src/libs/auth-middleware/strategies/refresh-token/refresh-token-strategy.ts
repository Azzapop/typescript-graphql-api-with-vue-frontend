import type { VerifyCallback } from 'passport-custom';
import { Strategy as CustomStrategy } from 'passport-custom';
import { refreshTokens } from '~libs/auth-tokens';
import { UserStore, RefreshTokenStore } from '~libs/domain-model';

const verifyRefreshTokenCallback: VerifyCallback = async (req, done) => {
  const {
    cookies: { refresh_token: refreshToken },
  } = req;

  const payload = await refreshTokens.verifyRefreshToken(refreshToken);
  if (!payload) {
    // Invalid token
    done(null, false);
    return;
  }

  const { sub: userId, refreshTokenId, tokenVersion } = payload;

  const user = await UserStore.getById(userId);
  if (!user || user.tokenVersion !== tokenVersion) {
    // Token versions don't match, clear the token family
    await RefreshTokenStore.clearTokenFamily(userId);
    done(null, false);
  }

  const youngestRefreshToken = await RefreshTokenStore.findYoungest(userId);
  if (!youngestRefreshToken || youngestRefreshToken.id !== refreshTokenId) {
    // Refreshtoken no longer valid, clear the token family
    await RefreshTokenStore.clearTokenFamily(userId);
    done(null, false);
  }

  done(null, user);
};

export const refreshTokenStrategy = new CustomStrategy(
  verifyRefreshTokenCallback
);
