import { expressMiddleware } from '@apollo/server/express4';
import { authenticate } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { createApolloServer } from './create-apollo-server';

export const entry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/graphql',
      appName: 'graphql',
      configure: async (router, { httpServer }) => {
        const apolloServer = createApolloServer({ httpServer });

        await apolloServer.start();

        const apolloServerMiddleware = expressMiddleware(apolloServer, {
          context: async ({ req }) => {
            const user = req.getUser();
            return { user };
          },
        });

        router.use(authenticate('access-token', { onFailure: 'reject' }));
        router.use(apolloServerMiddleware);
      },
    },
    context
  );
