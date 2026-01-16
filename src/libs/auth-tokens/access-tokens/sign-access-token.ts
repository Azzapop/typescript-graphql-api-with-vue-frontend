import { SignJWT } from 'jose';
import type { User } from '~libs/domain-model';
import { ACCESS_SECRET, ACCESS_TTL_TIMESPAN } from './const';

export const signAccessToken = async (user: User): Promise<string> => {
  return new SignJWT({ tokenVersion: user.tokenVersion })
    .setSubject(user.id)
    .setExpirationTime(ACCESS_TTL_TIMESPAN)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(ACCESS_SECRET);
};
