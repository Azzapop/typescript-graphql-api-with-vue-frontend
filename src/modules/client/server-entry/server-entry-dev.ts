import type { Express } from 'express';
import { readFileSync } from 'node:fs';
import { resolve } from 'path';
import { createViteServer } from '~libs/vite';
import { createServerHandler } from './create-server-handler';

export const serverEntryDev = async () => {
  const vite = await createViteServer();

  const resolvedPath = resolve(import.meta.dirname, '../../../../index.html');
  const template = readFileSync(resolvedPath, 'utf-8');

  const serverHandler = createServerHandler({ vite, template });

  const inject = (expressServer: Express) => {
    expressServer.use(vite.middlewares);
    // TODO client needs special auth middleware to validate auth token, then refresh token, if refresh is valid, issue new tokens, otherwise redirect to login page
    expressServer.use('*', serverHandler);
  };

  return { inject };
};
