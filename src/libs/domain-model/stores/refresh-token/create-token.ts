import type { RefreshToken, User } from '../../models';
import { prisma } from '../../prisma';

export const createToken = async (user: User): Promise<RefreshToken> => {
  const { id: userId } = user;
  return prisma.refreshToken.create({ data: { userId } });
};
