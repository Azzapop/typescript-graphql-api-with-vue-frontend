import { expressMiddleware } from '@apollo/server/express4';
import { Server as HttpServer } from 'http';
import { createApolloServer } from './server';

export const graphql = async (opts: {
  httpServer?: HttpServer;
}): Promise<any> => {
  const apolloServer = await createApolloServer(opts);

  await apolloServer.start();

  const middleware = expressMiddleware(apolloServer, {
    // TODO setup the context in a better way
    context: async ({ req }) => ({ token: req.headers.token }),
  });

  return middleware;
};
