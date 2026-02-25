import type { RefreshToken } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { handleRepositoryError } from '../handle-repository-error';
import type { RepositoryError } from '../repository-types';

export const findYoungest = async (
  userId: string
): Promise<Result<RefreshToken | null, RepositoryError>> => {
  try {
    const data = await prisma().refreshToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(
      `Failed to find youngest refresh token for userId "${userId}"`
    );
    return handleRepositoryError(parsed);
  }
};
