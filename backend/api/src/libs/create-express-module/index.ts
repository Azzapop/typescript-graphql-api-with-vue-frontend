import type { Router, ErrorRequestHandler, Express } from 'express';
import express from 'express';
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
    // Need to cast this to Router as the express types don't catch up
    // TODO monkey patch it?
    router: app.router as unknown as Router,
    routes,
  });
  app.use(basePath, router);

  app.use(errorHandler);

  app.set('x-powered-by', false);

  return app;
};
