import { jwtVerify } from 'jose';
import { ACCESS_SECRET } from './const';

interface AccessTokenPayload {
  sub: string;
  tokenVersion: string;
}

export const verifyAccessToken = async (
  token: string
): Promise<AccessTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(
      token,
      ACCESS_SECRET
    );
    return payload;
  } catch {
    return null;
  }
};
