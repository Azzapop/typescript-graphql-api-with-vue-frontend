import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { User } from '../../models';

type GetByIdError = 'UNEXPECTED_ERROR';

export const getById = async (
  id: string
): Promise<Result<User | null, GetByIdError>> => {
  try {
    const data = await prisma().user.findUnique({ where: { id } });
    return { success: true, data };
  } catch (e) {
    parsePrismaError(e);
    logger.error(`Failed to get user by id "${id}": ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
