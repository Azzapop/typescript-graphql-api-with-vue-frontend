import { createRouter, createMemoryHistory } from 'vue-router';
import { ROUTES, BASE_PATH } from './routes';

/**
 * Check if a route path is public (doesn't require authentication).
 * Uses a temporary router instance to resolve the path and check its meta.
 */
export const isPublicRoute = (path: string): boolean => {
  const router = createRouter({
    history: createMemoryHistory(BASE_PATH),
    routes: ROUTES,
  });
  const resolved = router.resolve(path);
  return resolved.meta.public === true;
};
