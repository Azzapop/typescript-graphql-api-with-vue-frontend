import { createExpressModule } from '@libs/create-express-module';
import { routes } from './routes';
import { errorHandler } from './routes/middleware/errorHandler';

export const api = createExpressModule({
  basePath: '/api',
  routes,
  errorHandler,
});
