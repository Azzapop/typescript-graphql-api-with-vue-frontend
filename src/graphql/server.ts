import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import type { Server as HttpServer } from 'http';
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

interface MyContext {
  token?: string;
}

export const createApolloServer = async (opts: {
  httpServer?: HttpServer;
}): Promise<ApolloServer> => {
  const { httpServer } = opts;

  const plugins = [];

  if (httpServer) {
    plugins.push(ApolloServerPluginDrainHttpServer({ httpServer }));
  }

  const apolloServer = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins,
  });

  return apolloServer;
};
