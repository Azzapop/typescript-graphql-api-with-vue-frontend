import type { User, RefreshToken } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { handleRepositoryError } from '../handle-repository-error';
import type { RepositoryError } from '../repository-types';

export const createToken = async (
  user: User
): Promise<Result<RefreshToken, RepositoryError>> => {
  const { id: userId } = user;

  try {
    const data = await prisma().refreshToken.create({ data: { userId } });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to create refresh token for userId "${userId}"`);
    return handleRepositoryError(parsed);
  }
};
