import type { Express } from 'express';
import express, { Router, json, urlencoded } from 'express';
import { createRoutes } from './create-routes';

export const createApiServer = (): Express => {
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  const router = Router();
  const routes = createRoutes(router);
  app.use('/auth', routes);

  // TODO error handler

  app.set('x-powered-by', false);

  return app;
};
