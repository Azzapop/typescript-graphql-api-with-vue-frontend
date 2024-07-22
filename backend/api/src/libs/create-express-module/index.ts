import type { ErrorRequestHandler, Express } from 'express';
import express, { Router } from 'express';
import { injectRoutes } from './inject-routes';
import type { Routes } from './types';

export const createExpressModule = (opts: {
  basePath: string;
  routes: Routes;
  errorHandler: ErrorRequestHandler;
}): Express => {
  const { basePath, routes, errorHandler } = opts;

  const app = express();

  const router = injectRoutes({
    router: Router(),
    routes,
  });
  app.use(basePath, router);

  app.use(errorHandler);

  app.set('x-powered-by', false);

  return app;
};
