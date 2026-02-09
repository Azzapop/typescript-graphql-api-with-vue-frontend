import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'express';
import type { Express } from 'express';
import type { Server as HttpServer } from 'http';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { createApolloServer } from './create-apollo-server';

export const entry = async (opts: { httpServer?: HttpServer }) => {
  const apolloServer = createApolloServer(opts);

  await apolloServer.start();

  const apolloServerMiddleware = expressMiddleware(apolloServer, {
    // TODO implement gql auth middleware here
    context: async ({ req: _req }) => {
      return {};
    },
  });

  const inject = (expressServer: Express): void => {
    expressServer.use(
      '/graphql',
      traceContext,
      cors(),
      json(),
      apolloServerMiddleware
    );
  };

  return { inject };
};
