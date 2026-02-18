import { generateTokenVersion } from '~libs/auth-tokens';
import type { User } from '../../models';
import { prisma } from '../../prisma';

export const rotateTokenVersion = async (userId: User['id']): Promise<void> => {
  const tokenVersion = generateTokenVersion();
  await prisma.user.update({ data: { tokenVersion }, where: { id: userId } });
};
