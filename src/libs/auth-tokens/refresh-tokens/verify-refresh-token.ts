import { jwtVerify } from 'jose';
import { REFRESH_SECRET } from './const';

interface RefreshTokenPayload {
  sub: string;
  tokenVersion: string;
  refreshTokenId: string;
}

export const verifyRefreshToken = async (
  token: string
): Promise<RefreshTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify<RefreshTokenPayload>(
      token,
      REFRESH_SECRET
    );
    return payload;
  } catch {
    return null;
  }
};
