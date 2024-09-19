import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

export const createSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}
