import cors from 'cors';
import express, { Express } from 'express';
import http, { Server as HttpServer } from 'http';
import path from 'path';
import serveIndex from 'serve-index';
import { serverEntry as clientServerEntry } from './client';
import { graphql } from './graphql';

const configureExpressServer = async (
  expressServer: Express,
  opts: { httpServer?: HttpServer }
): Promise<void> => {
  const { httpServer } = opts;

  // Configure public path to load assets
  const publicPath = path.join(__dirname, 'public');
  expressServer.use(
    '/public',
    express.static(publicPath),
    serveIndex(publicPath, { icons: true, view: 'details' })
  );

  // Configure graphql server for data
  const graphqlServer = await graphql({ httpServer });
  expressServer.use('/graphql', cors(), express.json(), graphqlServer);

  // All other paths load our client
  expressServer.use('*', clientServerEntry);

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
