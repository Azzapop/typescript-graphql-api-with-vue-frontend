import { createViteServer } from '@libs/vite';
import type { Express } from 'express';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve } from 'path';
import { serverHandler } from './server-handler';

const resolve = (p: string) => pathResolve(import.meta.dirname, p);

export const devEntry = async () => {
  const vite = await createViteServer();
  const template = readFileSync(resolve('../../index.html'), 'utf-8');

  const appServerHandler = serverHandler({ vite, template });

  const inject = (expressServer: Express) => {
    expressServer.use(vite.middlewares);
    expressServer.use('*', appServerHandler);
  };

  return { inject };
};
