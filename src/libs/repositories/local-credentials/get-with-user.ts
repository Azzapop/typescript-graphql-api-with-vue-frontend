import type { LocalCredentials, User } from '@prisma/client';
import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import { handleRepositoryError } from '../handle-repository-error';
import type { RepositoryError } from '../repository-types';

type LocalCredentialsWithUser = LocalCredentials & { user: User };

export const getWithUser = async (
  username: string
): Promise<Result<LocalCredentialsWithUser | null, RepositoryError>> => {
  try {
    const data = await prisma().localCredentials.findUnique({
      where: { username },
      include: { user: true },
    });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(`Failed to get credentials for username "${username}"`);
    return handleRepositoryError(parsed);
  }
};
