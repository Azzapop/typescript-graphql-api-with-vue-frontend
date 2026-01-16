import type { RefreshToken } from '../../models';
import { prisma } from '../../prisma';

export const findYoungest = async (
  userId: string
): Promise<RefreshToken | null> => {
  return prisma.refreshToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
