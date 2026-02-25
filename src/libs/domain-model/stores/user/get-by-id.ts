import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { User } from '../../models';
import type { StoreError } from '../stores-types';

export const getById = async (
  id: string
): Promise<Result<User | null, StoreError>> => {
  try {
    const data = await prisma().user.findUnique({ where: { id } });
    return { success: true, data };
  } catch (e) {
    const error = parsePrismaError(e);
    logger.error(`Failed to get user by id "${id}" [${error.code}]`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
