import express from 'express';
import type { Express } from 'express';
import { createServer } from 'http';
import { entry as authEntry } from '../../src/modules/auth/entry.js';
import { entry as graphqlEntry } from '../../src/modules/graphql/entry.js';

export const createTestApp = async (): Promise<Express> => {
  const app = express();
  const httpServer = createServer(app);

  const [authModule, graphqlModule] = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
  ]);

  app.use(authModule.path, authModule.router);
  app.use(graphqlModule.path, graphqlModule.router);

  return app;
};
