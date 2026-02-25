import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { LocalCredentials, User } from '../../models';

type LocalCredentialsWithUser = LocalCredentials & { user: User };

type GetWithUserError = 'UNEXPECTED_ERROR';

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
    parsePrismaError(e);
    logger.error(`Failed to get credentials for username "${username}": ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
