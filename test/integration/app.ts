import express from 'express';
import type { Express } from 'express';
import { createServer } from 'http';
import { entry as authEntry } from '../../src/modules/auth/entry.js';
import { entry as graphqlEntry } from '../../src/modules/graphql/entry.js';

/**
 * Create Express app for integration testing
 * Mounts auth and GraphQL modules just like production server
 * Does NOT mount client module (not needed for API testing)
 */
export const createTestApp = async (): Promise<Express> => {
  const app = express();
  const httpServer = createServer(app);

  // Mount auth and GraphQL modules
  const [authModule, graphqlModule] = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
  ]);

  app.use(authModule.path, authModule.router);
  app.use(graphqlModule.path, graphqlModule.router);

  return app;
};
