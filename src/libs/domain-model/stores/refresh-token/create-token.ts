import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RefreshToken, User } from '../../models';
import { handleStoreError } from '../handle-store-error';
import type { StoreError } from '../stores-types';

export const createToken = async (
  user: User
): Promise<Result<RefreshToken, StoreError>> => {
  const { id: userId } = user;

  try {
    const data = await prisma().refreshToken.create({ data: { userId } });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to create refresh token for userId "${userId}"`);
    return handleStoreError(parsed);
  }
};
