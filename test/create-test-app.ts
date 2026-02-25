import express from 'express';
import type { Express } from 'express';
import { createServer } from 'http';
import { entry as authEntry } from '~modules/auth';
import { entry as graphqlEntry } from '~modules/graphql';

export const createTestApp = async (): Promise<Express> => {
  const app = express();
  const httpServer = createServer(app);

  const [authModule, graphqlModule] = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
  ]);

  app.use(authModule.path, authModule.createRouter());
  app.use(graphqlModule.path, graphqlModule.createRouter());

  return app;
};
