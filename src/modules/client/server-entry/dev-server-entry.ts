import { readFileSync } from 'node:fs';
import { resolve } from 'path';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { createViteServer } from '~libs/vite';
import { createServerHandler } from './create-server-handler';

export const devServerEntry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/app',
      configure: async (router) => {
        const vite = await createViteServer();
        const resolvedPath = resolve(
          import.meta.dirname,
          '../../../../index.html'
        );
        const template = readFileSync(resolvedPath, 'utf-8');
        const serverHandler = createServerHandler({ vite, template });

        router.use(traceContext);
        router.use(vite.middlewares);
        // TODO client needs special auth middleware to validate auth token, then refresh token, if refresh is valid, issue new tokens, otherwise redirect to login page
        router.use('*', serverHandler);
      },
    },
    context
  );
