import type { User } from '../../models';
import { prisma } from '../../prisma';

export const getById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};
