import { Resolvers } from '@services/graphql/types';
import { Mutation } from './mutations';
import { Query } from './queries';

export const resolvers: Pick<Resolvers, 'Query' | 'Mutation'> = {
  Query,
  Mutation,
};
