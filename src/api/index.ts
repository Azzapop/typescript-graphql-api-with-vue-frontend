import { createExpressModule } from '@libs/create-express-module';
import { errorHandler } from './error-handler';
import { routes } from './routes';

export const api = createExpressModule({
  basePath: '/api',
  routes,
  errorHandler,
});
