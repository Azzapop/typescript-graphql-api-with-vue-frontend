import { prisma } from '~database';
import type { RefreshToken } from '../../models';

export const findYoungest = async (
  userId: string
): Promise<RefreshToken | null> => {
  return prisma().refreshToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
