import { createExpressModule } from '@libs/create-express-module';
import { Routes } from '@libs/create-express-module/types';
import { errorHandler } from '../api/error-handler';
import { paths } from './router';
import { server } from './server';

const routes: Routes = paths.map((path) => [path, { GET: [server] }]);

export const app = createExpressModule({
  basePath: '/',
  routes,
  errorHandler: errorHandler,
});
