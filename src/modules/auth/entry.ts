import { urlencoded } from 'express';
import { authenticate, initAuth } from '~libs/auth-middleware';
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
        router.use(urlencoded({ extended: true }));

        router.post(
          '/login/local',
          authenticate('local-credentials', { onFailure: 'reject' }),
          loginLocal
        );
        router.delete(
          '/logout',
          authenticate('refresh-token', { onFailure: 'reject' }),
          logout
        );
        router.post(
          '/refresh',
          authenticate('refresh-token', { onFailure: 'reject' }),
          refresh
        );
      },
    },
    context
  );
