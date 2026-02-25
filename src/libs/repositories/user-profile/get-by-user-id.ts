import { UserProfile } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RepositoryError } from '../repository-types';
import { handleRepositoryError } from '../handle-repository-error';

export const getByUserId = async (
  userId: string
): Promise<Result<UserProfile | null, RepositoryError>> => {
  try {
    const data = await prisma().userProfile.findUnique({ where: { userId } });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to get user profile for userId "${userId}"`);
    return handleRepositoryError(parsed);
  }
};
