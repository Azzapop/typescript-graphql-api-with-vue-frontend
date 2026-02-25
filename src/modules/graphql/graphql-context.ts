import type { User } from '@prisma/client';

export type GraphQLContext = {
  user: User;
};
