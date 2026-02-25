import type { User } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { handleRepositoryError } from '../handle-repository-error';
import type { RepositoryError } from '../repository-types';

export const getById = async (
  id: string
): Promise<Result<User | null, RepositoryError>> => {
  try {
    const data = await prisma().user.findUnique({ where: { id } });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to get user by id "${id}"`);
    return handleRepositoryError(parsed);
  }
};
