import { createViteServer } from '@libs/vite';
import compression from 'compression';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import type { Server as HttpServer } from 'http';
import http from 'http';
import fs from 'node:fs';
import path from 'path';
// import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import { serverHandler } from './client/server-handler';
import { graphql } from './graphql';

const resolve = (p: string) => path.resolve(import.meta.dirname, p);

const configureExpressServer = async (
  expressServer: Express,
  opts: { httpServer?: HttpServer }
): Promise<void> => {
  const { httpServer } = opts;

  // Configure graphql server for data
  const graphqlServer = await graphql({ httpServer });
  expressServer.use('/graphql', cors(), express.json(), graphqlServer);

  // For production we serve our pre-compiled static assets direct from the dist directory.
  // For all other environments we allow the vite dev server to serve our assets for us.
  if (process.env.NODE_ENV === 'production') {
    // Compress requests that come through
    expressServer.use(compression());

    // Configure public path to load assets
    const publicPath = path.join(import.meta.dirname, '../client/assets');
    console.log(publicPath);
    expressServer.use(
      '/assets',
      express.static(publicPath),
      serveStatic(`/dist${publicPath}`, { index: false })
      // TODO the Batch import in this package is causing issues with importing 'emitter'
      // serveIndex(publicPath, { icons: true, view: 'details' })
    );

    const manifest = JSON.parse(
      fs.readFileSync(resolve('../client/.vite/ssr-manifest.json'), 'utf-8')
    );
    const template = fs.readFileSync(resolve('../client/index.html'), 'utf-8');

    const appServerHandler = serverHandler({ manifest, template });
    expressServer.use('*', appServerHandler);
  } else {
    console.log('this one here');
    const vite = await createViteServer();
    expressServer.use(vite.middlewares);

    const template = fs.readFileSync(resolve('../index.html'), 'utf-8');

    const appServerHandler = serverHandler({ vite, template });
    expressServer.use('*', appServerHandler);
  }

  // @ts-expect-error
  // TODO move this out to a util function again
  // Error handler in case something goes wrong somewhere in our process
  expressServer.use((err, _req, res, _next) => {
    console.log('this is an error');
    console.log({ err });
    res.status(500).json({ e: 'error with the request' });
  });
};

export const server = async () => {
  const expressServer = express();

  const httpServer = http.createServer(expressServer);

  configureExpressServer(expressServer, { httpServer });

  return httpServer;
};
