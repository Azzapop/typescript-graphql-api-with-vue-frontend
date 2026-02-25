import { User } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { generateTokenVersion } from '~libs/auth-tokens';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RepositoryError } from '../repository-types';
import { handleRepositoryError } from '../handle-repository-error';

export const rotateTokenVersion = async (
  userId: User['id']
): Promise<Result<void, RepositoryError>> => {
  const tokenVersion = generateTokenVersion();

  try {
    await prisma().user.update({
      data: { tokenVersion },
      where: { id: userId },
    });
    return { success: true, data: undefined };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to rotate token version for userId "${userId}"`);
    return handleRepositoryError(parsed);
  }
};
