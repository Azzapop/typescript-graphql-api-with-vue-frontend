import { parsePrismaError, prisma } from '~database';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';

type ClearTokenFamilyError = 'UNEXPECTED_ERROR';

export const clearTokenFamily = async (
  userId: string
): Promise<Result<void, ClearTokenFamilyError>> => {
  try {
    await prisma().refreshToken.deleteMany({ where: { userId } });
    return { success: true, data: undefined };
  } catch (e) {
    parsePrismaError(e);
    logger.error(`Failed to clear token family for userId "${userId}": ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
