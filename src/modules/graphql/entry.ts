import { expressMiddleware } from '@apollo/server/express4';
import { authenticate } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { createApolloServer } from './create-apollo-server';
import type { GraphQLContext } from './graphql-context';

export const entry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/graphql',
      appName: 'graphql',
      configure: async (router, { httpServer }) => {
        const apolloServer = createApolloServer({ httpServer });

        await apolloServer.start();

        // Middleware to test network errors - must run BEFORE authentication
        // Returns 500 if test header is present
        router.use((req, res, next) => {
          if (req.headers['x-trigger-network-error'] === 'true') {
            // Add delay so loading page shows briefly before error
            setTimeout(() => {
              res.status(500).json({ error: 'Network error test' });
            }, 5000);
            return;
          }
          next();
        });

        router.use(authenticate('access-token', { onFailure: 'reject' }));

        const apolloServerMiddleware = expressMiddleware<GraphQLContext>(
          apolloServer,
          {
            context: async ({ req }): Promise<GraphQLContext> => {
              const user = req.getUser();
              return { user };
            },
          }
        );

        router.use(apolloServerMiddleware);
      },
    },
    context
  );
