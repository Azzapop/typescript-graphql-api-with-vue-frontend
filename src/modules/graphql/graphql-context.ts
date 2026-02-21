import type { User } from '~libs/domain-model';

export type GraphQLContext = {
  user: User;
};
