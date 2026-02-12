import type { UserProfile } from '@prisma/client';
import { prisma } from '../../prisma';

export const getByUserId = async (
  userId: string
): Promise<UserProfile | null> => {
  return prisma.userProfile.findUnique({ where: { userId } });
};
