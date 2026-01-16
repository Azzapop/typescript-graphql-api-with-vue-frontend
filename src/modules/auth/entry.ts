import cors from 'cors';
import type { Express } from 'express';
import { initAuth } from '~libs/auth-middleware';
import { createApiServer } from './create-api-server';

export const entry = async () => {
  const authApiServer = createApiServer();

  const inject = (expressServer: Express): void => {
    expressServer.use(initAuth());
    expressServer.use(cors(), authApiServer);
  };

  return { inject };
};
