import { prisma } from '~database';
import type { User } from '../../models';

export const getById = async (id: string): Promise<User | null> => {
  return prisma().user.findUnique({ where: { id } });
};
