import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import { authGuard } from './guards/auth-guard';
import { ROUTES, BASE_PATH } from './routes';

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer
    ? createMemoryHistory(BASE_PATH)
    : createWebHistory(BASE_PATH);

  const router = createRouter({
    history,
    routes: ROUTES,
  });

  // Register auth guard on client-side only
  if (!isServer) {
    router.beforeEach(authGuard);
  }

  return router;
};
