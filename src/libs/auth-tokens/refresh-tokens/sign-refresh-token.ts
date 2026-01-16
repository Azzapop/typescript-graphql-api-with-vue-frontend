import { SignJWT } from 'jose';
import type { User, RefreshToken } from '~libs/domain-model';
import { REFRESH_SECRET, REFRESH_TTL_TIMESPAN } from './const';

export const signRefreshToken = async (
  user: User,
  refreshToken: RefreshToken
): Promise<string> => {
  return new SignJWT({
    tokenVersion: user.tokenVersion,
    refreshTokenId: refreshToken.id,
  })
    .setSubject(user.id)
    .setExpirationTime(REFRESH_TTL_TIMESPAN)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(REFRESH_SECRET);
};
