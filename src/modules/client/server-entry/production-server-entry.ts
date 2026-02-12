import compression from 'compression';
import cookieParser from 'cookie-parser';
import { static as expressStatic } from 'express';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'path';
import serveStatic from 'serve-static';
import { initAuth, authenticate } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { trace } from '~libs/trace-context';
import { isPublicRoute } from '../app/is-public-route';
import { BASE_PATH } from '../app/routes';
import { createServerHandler } from './create-server-handler';

const RESOLVE = (p: string) => pathResolve(import.meta.dirname, p);

export const productionServerEntry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: BASE_PATH,
      appName: 'client',
      configure: (router) => {
        const manifest = JSON.parse(
          readFileSync(RESOLVE('../client/.vite/ssr-manifest.json'), 'utf-8')
        );
        const template = readFileSync(RESOLVE('../client/index.html'), 'utf-8');
        const serverHandler = createServerHandler({ manifest, template });
        const publicPath = pathJoin(import.meta.dirname, '../client/assets');

        router.use(trace('client'));
        router.use(cookieParser());
        router.use(initAuth());
        router.use(
          authenticate('client-credentials', {
            onFailure: 'redirect',
            isPublicRoute,
            loginPath: '/login',
          })
        );
        router.use(compression());
        router.use(
          '/assets',
          expressStatic(publicPath),
          serveStatic(`/dist${publicPath}`, { index: false })
        );
        router.use('*', serverHandler);
      },
    },
    context
  );
