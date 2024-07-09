import { jsonBodyParser } from './middleware/jsonBodyParser';
import { openApiValidator } from './middleware/openApiValidator';
import { routes } from './routes';
import { setupApiModule } from '../util/setupApiModule';
import { errorHandler } from './middleware/errorHandler'

export const api = setupApiModule({
  middleware: [jsonBodyParser, openApiValidator],
  routes,
  errorHandler,
})
