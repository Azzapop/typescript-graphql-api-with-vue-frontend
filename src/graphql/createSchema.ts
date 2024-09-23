import { makeExecutableSchema } from '@graphql-tools/schema';
import type { GraphQLSchema } from 'graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

export const createSchema = (): GraphQLSchema => {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};
