import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import type { Express } from 'express';
import { json } from 'express';
import type { Server as HttpServer } from 'http';
import { createApolloServer } from './server';

export const graphql = async (opts: {
  httpServer?: HttpServer;
}): Promise<any> => {
  const apolloServer = createApolloServer(opts);

  await apolloServer.start();

  const graphqlServerMiddleware = expressMiddleware(apolloServer, {
    // TODO setup the context in a better way
    context: async ({ req }) => ({ token: req.headers.token }),
  });

  const inject = (expressServer: Express): void => {
    expressServer.use('/graphql', cors(), json(), graphqlServerMiddleware);
  };

  return { inject };
};
