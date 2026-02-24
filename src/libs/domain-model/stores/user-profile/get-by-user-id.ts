import type { UserProfile } from '@prisma/client';
import { prisma } from '~database';

export const getByUserId = async (
  userId: string
): Promise<UserProfile | null> => {
  return prisma().userProfile.findUnique({ where: { userId } });
};
