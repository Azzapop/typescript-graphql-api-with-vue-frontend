import { jwtVerify } from 'jose';
import type { Result } from '~libs/result';
import { ACCESS_SECRET } from './access-tokens-const';

export interface AccessTokenPayload {
  sub: string;
  tokenVersion: string;
}

export const verifyAccessToken = async (
  token: string
): Promise<Result<AccessTokenPayload>> => {
  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(
      token,
      ACCESS_SECRET
    );
    return { success: true, data: payload };
  } catch {
    return { success: false, error: 'INVALID' };
  }
};
