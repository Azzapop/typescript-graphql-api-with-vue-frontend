import { prisma } from '~database';
import type { RefreshToken, User } from '../../models';

export const createToken = async (user: User): Promise<RefreshToken> => {
  const { id: userId } = user;
  return prisma().refreshToken.create({ data: { userId } });
};
