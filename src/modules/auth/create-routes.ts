import type { Router } from 'express';
import { authenticate } from '~libs/auth-middleware';
import { loginLocal, logout, refresh } from './routes';

// TODO specifically typed router same as handlers
export const createRoutes = (router: Router): Router => {
  router.post('/login/local', authenticate('local'), loginLocal);
  router.delete('/logout', authenticate('access-token'), logout);
  router.post('/refresh', authenticate('refresh-token'), refresh);
  return router;
};
