import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'express';
import { authenticate } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { createApolloServer } from './create-apollo-server';

export const entry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/graphql',
      configure: async (router, { httpServer }) => {
        const apolloServer = createApolloServer({ httpServer });

        await apolloServer.start();

        const apolloServerMiddleware = expressMiddleware(apolloServer, {
          context: async ({ req }) => {
            const { user } = req;
            if (!user) {
              throw new Error(
                'Creating Gql context without user, something wrong with Authentication.'
              );
            }
            return { user };
          },
        });

        router.use(traceContext);
        router.use(cors());
        router.use(json());
        router.use(authenticate('access-token'));
        router.use(apolloServerMiddleware);
      },
    },
    context
  );
