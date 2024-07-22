import { createExpressModule } from '@libs/create-express-module';
import { api } from './api';
import { errorHandler } from './api/error-handler';

export const server = createExpressModule({
  basePath: '/',
  routes: [['*', { USE: [api] }]],
  errorHandler: errorHandler, // TODO more generic one that handles html/json
});
