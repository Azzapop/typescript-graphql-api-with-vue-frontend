import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { handleRepositoryError } from '../handle-repository-error';
import type { RepositoryError } from '../repository-types';

export const clearTokenFamily = async (
  userId: string
): Promise<Result<void, RepositoryError>> => {
  try {
    await prisma().refreshToken.deleteMany({ where: { userId } });
    return { success: true, data: undefined };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to clear token family for userId "${userId}"`);
    return handleRepositoryError(parsed);
  }
};
