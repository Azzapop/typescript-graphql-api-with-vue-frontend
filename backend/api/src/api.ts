import type { Express } from 'express';
import express, { Router } from 'express';
import { errorHandler } from './middleware/errorHandler';
import { jsonBodyParser } from './middleware/jsonBodyParser';
import { openApiValidator } from './middleware/openApiValidator';
import { injectRoutes } from './routes';

export const createApi = (): Express => {
  const api: Express = express();

  // Parse our content into json
  api.use(jsonBodyParser);

  // Validate request and response against swagger docs
  api.use(openApiValidator);

  let router = Router();
  router = injectRoutes(router);
  api.use(router);

  // Error handler, must be last to ensure that we handle all errors
  api.use(errorHandler);

  return api;
};
