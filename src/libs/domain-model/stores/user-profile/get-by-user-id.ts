import { prisma } from '~database';
import type { UserProfile } from '../../models';

export const getByUserId = async (
  userId: string
): Promise<UserProfile | null> => {
  return prisma().userProfile.findUnique({ where: { userId } });
};
