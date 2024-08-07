import { createExpressModule } from '@libs/create-express-module';
import * as express from 'express';
import path from 'path';
import serveIndex from 'serve-index';
import { api } from './api';
import { errorHandler } from './api/error-handler';
import { app } from './app';

const publicPath = path.join(__dirname, 'public');

export const server = createExpressModule({
  basePath: '/',
  routes: [
    [
      '/public',
      {
        USE: [
          express.static(publicPath),
          serveIndex(publicPath, { icons: true }),
        ],
      },
    ],
    [null, { USE: [api, app] }],
  ],
  errorHandler: errorHandler, // TODO more generic one that handles html/json
});
