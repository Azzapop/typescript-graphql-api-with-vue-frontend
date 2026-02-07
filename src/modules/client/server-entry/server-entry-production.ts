import compression from 'compression';
import type { Express } from 'express';
import { static as expressStatic } from 'express';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'path';
import serveStatic from 'serve-static';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { createServerHandler } from './create-server-handler';

const RESOLVE = (p: string) => pathResolve(import.meta.dirname, p);

export const serverEntryProduction = () => {
  const manifest = JSON.parse(
    readFileSync(RESOLVE('../client/.vite/ssr-manifest.json'), 'utf-8')
  );
  const template = readFileSync(RESOLVE('../client/index.html'), 'utf-8');
  const serverHandler = createServerHandler({ manifest, template });

  const publicPath = pathJoin(import.meta.dirname, '../client/assets');

  const inject = (expressServer: Express): void => {
    expressServer.use(traceContext);
    // Compress requests that come through
    expressServer.use(compression());

    // Configure public path to load assets
    expressServer.use(
      '/assets',
      expressStatic(publicPath),
      serveStatic(`/dist${publicPath}`, { index: false })
    );

    expressServer.use('*', serverHandler);
  };

  return { inject };
};
