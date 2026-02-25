import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RefreshToken, User } from '../../models';
import type { StoreError } from '../stores-types';

export const createToken = async (
  user: User
): Promise<Result<RefreshToken, StoreError>> => {
  const { id: userId } = user;

  try {
    const data = await prisma().refreshToken.create({ data: { userId } });
    return { success: true, data };
  } catch (e) {
    const error = parsePrismaError(e);

    if (error.code === 'FOREIGN_KEY_CONSTRAINT') {
      logger.error(`Failed to create refresh token: user "${userId}" not found`);
      return { success: false, error: 'FOREIGN_KEY_CONSTRAINT' };
    }

    logger.error(`Failed to create refresh token for userId "${userId}" [${error.code}]`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
