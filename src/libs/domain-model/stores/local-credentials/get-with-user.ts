import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { LocalCredentials, User } from '../../models';
import type { StoreError } from '../stores-types';

type LocalCredentialsWithUser = LocalCredentials & { user: User };

type GetWithUserError = Extract<StoreError, 'UNEXPECTED_ERROR'>;

export const getWithUser = async (
  username: string
): Promise<Result<LocalCredentialsWithUser | null, GetWithUserError>> => {
  try {
    const data = await prisma().localCredentials.findUnique({
      where: { username },
      include: { user: true },
    });
    return { success: true, data };
  } catch (e) {
    const error = parsePrismaError(e);
    logger.error(`Failed to get credentials for username "${username}" [${error.code}]: ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
