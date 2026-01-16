import { prisma } from '../../prisma';

export const clearTokenFamily = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};
