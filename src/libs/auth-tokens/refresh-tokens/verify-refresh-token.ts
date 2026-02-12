import { jwtVerify } from 'jose';
import type { Result } from '~libs/result';
import { REFRESH_SECRET } from './refresh-tokens-const';

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion: string;
  refreshTokenId: string;
}

export const verifyRefreshToken = async (
  token: string
): Promise<Result<RefreshTokenPayload>> => {
  try {
    const { payload } = await jwtVerify<RefreshTokenPayload>(
      token,
      REFRESH_SECRET
    );
    return { success: true, data: payload };
  } catch {
    return { success: false, error: 'INVALID' };
  }
};
