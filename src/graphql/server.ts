import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import type { Server as HttpServer } from 'http';
import { createSchema } from './createSchema';

interface MyContext {
  token?: string;
}

export const createApolloServer = (opts: {
  httpServer?: HttpServer;
}): ApolloServer => {
  const { httpServer } = opts;

  const plugins = [];

  if (httpServer) {
    plugins.push(ApolloServerPluginDrainHttpServer({ httpServer }));
  }

  const schema = createSchema();

  const apolloServer = new ApolloServer<MyContext>({
    schema,
    plugins,
  });

  return apolloServer;
};
