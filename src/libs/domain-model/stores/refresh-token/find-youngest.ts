import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RefreshToken } from '../../models';

type FindYoungestError = 'UNEXPECTED_ERROR';

export const findYoungest = async (
  userId: string
): Promise<Result<RefreshToken | null, FindYoungestError>> => {
  try {
    const data = await prisma().refreshToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  } catch (e) {
    parsePrismaError(e);
    logger.error(`Failed to find youngest refresh token for userId "${userId}": ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
