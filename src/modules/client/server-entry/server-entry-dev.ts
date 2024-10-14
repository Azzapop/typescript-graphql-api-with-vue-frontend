import { createViteServer } from '@libs/vite';
import type { Express } from 'express';
import { readFileSync } from 'node:fs';
import { resolve } from 'path';
import { createServerHandler } from './create-server-handler';

export const serverEntryDev = async () => {
  const vite = await createViteServer();

  const resolvedPath = resolve(import.meta.dirname, '../../../index.html');
  const template = readFileSync(resolvedPath, 'utf-8');

  const serverHandler = createServerHandler({ vite, template });

  const inject = (expressServer: Express) => {
    expressServer.use(vite.middlewares);
    expressServer.use('*', serverHandler);
  };

  return { inject };
};
