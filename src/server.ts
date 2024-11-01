import type { Express } from 'express';
import express from 'express';
import type { Server as HttpServer } from 'http';
import http from 'http';
import {
  serverEntryDev as clientServerEntryDev,
  serverEntryProduction as clientServerEntryProduction,
} from '~modules/client';
import { entry as graphqlEntry } from '~modules/graphql';

const configureExpressServer = async (
  expressServer: Express,
  opts: { httpServer?: HttpServer }
): Promise<void> => {
  const { httpServer } = opts;

  // Configure graphql server for data
  const { inject: injectGraphqlServer } = await graphqlEntry({ httpServer });
  injectGraphqlServer(expressServer);

  /*
   *  Configure our client application with SSR
   *
   *  For production we serve our pre-compiled static assets direct from the dist directory.
   *  For all other environments we allow the vite dev server to serve our assets for us.
   *
   *  TODO Change to dynamic imports here so that we can tree shake either path out. Will need
   *  to use vite.ssrLoadModule for dev and inject it into the entry point
   */
  if (process.env.NODE_ENV === 'production') {
    const { inject: injectClientEntryProduction } =
      clientServerEntryProduction();
    injectClientEntryProduction(expressServer);
  } else {
    const { inject: injectClientEntryDev } = await clientServerEntryDev();
    injectClientEntryDev(expressServer);
  }

  // @ts-expect-error implicit any types
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
