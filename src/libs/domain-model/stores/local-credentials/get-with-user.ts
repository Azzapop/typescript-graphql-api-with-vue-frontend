import { prisma } from '~database';
import type { LocalCredentials, User } from '../../models';

type LocalCredentialsWithUser = LocalCredentials & { user: User };

export const getWithUser = async (
  username: string
): Promise<LocalCredentialsWithUser | null> => {
  return prisma().localCredentials.findUnique({
    where: { username },
    include: { user: true },
  });
};
