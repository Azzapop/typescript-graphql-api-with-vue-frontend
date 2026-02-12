import express from 'express';
import http from 'http';
import { logger } from '~libs/logger';
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

  // @ts-expect-error implicit any types
  // TODO move this out to a util function again
  // Error handler in case something goes wrong somewhere in our process
  expressServer.use((err, _req, res, _next) => {
    logger.request.error('===== Error handler middleware =====');
    logger.request.error(JSON.stringify({ err }));
    logger.request.error('====================================');
    res.status(500).json({ e: 'error with the request' });
  });

  return httpServer;
};
