import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RefreshToken } from '../../models';
import { handleStoreError } from '../handle-store-error';
import type { StoreError } from '../stores-types';

export const findYoungest = async (
  userId: string
): Promise<Result<RefreshToken | null, StoreError>> => {
  try {
    const data = await prisma().refreshToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error(
      `Failed to find youngest refresh token for userId "${userId}"`
    );
    return handleStoreError(parsed);
  }
};
