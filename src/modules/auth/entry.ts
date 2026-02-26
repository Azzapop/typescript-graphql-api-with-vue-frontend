import { asyncHandler } from '~libs/async-handler';
import { authenticate, initAuth } from '~libs/auth-middleware';
import { errorHandler } from '~libs/error-handler';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { loginLocal, logout, refresh } from './routes';

export const entry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/auth',
      appName: 'auth-api',
      configure: (router) => {
        router.use(initAuth());

        router.post(
          '/login/local',
          authenticate('local-credentials', { onFailure: 'reject' }),
          asyncHandler(loginLocal)
        );
        router.delete(
          '/logout',
          authenticate('refresh-token', { onFailure: 'reject' }),
          asyncHandler(logout)
        );
        router.post(
          '/refresh',
          authenticate('refresh-token', { onFailure: 'reject' }),
          asyncHandler(refresh)
        );

        router.use(errorHandler);
      },
    },
    context
  );
