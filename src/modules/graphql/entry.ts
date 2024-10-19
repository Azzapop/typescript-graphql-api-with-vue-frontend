import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'express';
import type { Express } from 'express';
import type { Server as HttpServer } from 'http';
import { createApolloServer } from './create-apollo-server';

export const entry = async (opts: { httpServer?: HttpServer }) => {
  const apolloServer = createApolloServer(opts);

  await apolloServer.start();

  const apolloServerMiddleware = expressMiddleware(apolloServer, {
    // TODO setup the context in a better way
    context: async ({ req }) => ({ token: req.headers.token }),
  });

  const inject = (expressServer: Express): void => {
    expressServer.use('/graphql', cors(), json(), apolloServerMiddleware);
  };

  return { inject };
};
