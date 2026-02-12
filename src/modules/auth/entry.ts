import cors from 'cors';
import { json, urlencoded } from 'express';
import { authenticate, initAuth } from '~libs/auth-middleware';
import type { ModuleContext } from '~libs/module';
import { createModule } from '~libs/module';
import { traceExpressMiddleware as traceContext } from '~libs/trace-context';
import { loginLocal, logout, refresh } from './routes';

export const entry = (context: ModuleContext = {}) =>
  createModule(
    {
      path: '/auth',
      configure: (router) => {
        router.use(traceContext);
        router.use(initAuth());
        router.use(cors());
        router.use(json());
        router.use(urlencoded({ extended: true }));

        router.post('/login/local', authenticate('local'), loginLocal);
        router.delete('/logout', authenticate('access-token'), logout);
        router.post('/refresh', authenticate('refresh-token'), refresh);
      },
    },
    context
  );
