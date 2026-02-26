import express from 'express';
import http from 'http';
import { errorHandler } from '~libs/error-handler';
import { mountModules } from '~libs/module';
import { entry as authEntry } from '~modules/auth';
import { entry as clientEntry } from '~modules/client';
import { entry as graphqlEntry } from '~modules/graphql';

export const server = async () => {
  const expressServer = express();
  const httpServer = http.createServer(expressServer);

  const modules = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
    clientEntry(),
  ]);

  mountModules(expressServer, modules);
  expressServer.use(errorHandler);

  return httpServer;
};
