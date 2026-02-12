import compression from 'compression';
import { static as expressStatic } from 'express';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'path';
import serveStatic from 'serve-static';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { createServerHandler } from './create-server-handler';

const RESOLVE = (p: string) => pathResolve(import.meta.dirname, p);

export const productionServerEntry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/app',
      configure: (router) => {
        const manifest = JSON.parse(
          readFileSync(RESOLVE('../client/.vite/ssr-manifest.json'), 'utf-8')
        );
        const template = readFileSync(RESOLVE('../client/index.html'), 'utf-8');
        const serverHandler = createServerHandler({ manifest, template });
        const publicPath = pathJoin(import.meta.dirname, '../client/assets');

        router.use(traceContext);
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
