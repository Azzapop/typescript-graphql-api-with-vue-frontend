import { readFileSync } from 'node:fs';
import { resolve } from 'path';
import { initAuth, authenticate } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { createViteServer } from '~libs/vite';
import { isPublicRoute } from '../app/is-public-route';
import { BASE_PATH } from '../app/routes';
import { createServerHandler } from './create-server-handler';

export const devServerEntry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: BASE_PATH,
      appName: 'client',
      configure: async (router) => {
        const vite = await createViteServer();
        const resolvedPath = resolve(
          import.meta.dirname,
          '../../../../index.html'
        );
        const template = readFileSync(resolvedPath, 'utf-8');
        const serverHandler = createServerHandler({ vite, template });

        router.use(vite.middlewares);
        router.use(initAuth());
        router.use(
          authenticate('client-credentials', {
            onFailure: 'redirect',
            isPublicRoute,
            loginPath: '/login',
          })
        );
        router.use('*', serverHandler);
      },
    },
    context
  );
