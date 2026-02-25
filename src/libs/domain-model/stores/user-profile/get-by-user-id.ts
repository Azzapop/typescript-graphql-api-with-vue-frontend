import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { UserProfile } from '../../models';
import type { StoreError } from '../stores-types';

type GetByUserIdError = Extract<StoreError, 'UNEXPECTED_ERROR'>;

export const getByUserId = async (
  userId: string
): Promise<Result<UserProfile | null, GetByUserIdError>> => {
  try {
    const data = await prisma().userProfile.findUnique({ where: { userId } });
    return { success: true, data };
  } catch (e) {
    const error = parsePrismaError(e);
    logger.error(`Failed to get user profile for userId "${userId}" [${error.code}]: ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
