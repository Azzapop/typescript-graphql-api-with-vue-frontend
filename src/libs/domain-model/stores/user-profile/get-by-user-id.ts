import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { UserProfile } from '../../models';
import { handleStoreError } from '../handle-store-error';
import type { StoreError } from '../stores-types';

export const getByUserId = async (
  userId: string
): Promise<Result<UserProfile | null, StoreError>> => {
  try {
    const data = await prisma().userProfile.findUnique({ where: { userId } });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to get user profile for userId "${userId}"`);
    return handleStoreError(parsed);
  }
};
