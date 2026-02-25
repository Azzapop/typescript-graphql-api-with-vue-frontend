import { parsePrismaError, prisma } from '~database';
import { generateTokenVersion } from '~libs/auth-tokens';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { User } from '../../models';

type RotateTokenVersionError = 'NOT_FOUND' | 'UNEXPECTED_ERROR';

export const rotateTokenVersion = async (
  userId: User['id']
): Promise<Result<void, RotateTokenVersionError>> => {
  const tokenVersion = generateTokenVersion();

  try {
    await prisma().user.update({ data: { tokenVersion }, where: { id: userId } });
    return { success: true, data: undefined };
  } catch (e) {
    const error = parsePrismaError(e);

    if (error.code === 'RECORD_NOT_FOUND') {
      logger.error(`Failed to rotate token version: user "${userId}" not found`);
      return { success: false, error: 'NOT_FOUND' };
    }

    logger.error(`Failed to rotate token version for userId "${userId}": ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
