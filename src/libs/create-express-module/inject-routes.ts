import type { RequestHandler, Router } from 'express';
import type { RouteType, RouteDefinition, Routes } from './types';

const empty: RequestHandler = (_req, _res, next) => next();

// TODO genericise this to throw an error of the type the api expects
const notImplemented: RequestHandler = (_req, _res, _next) => {
  throw new Error('not implemented');
};

const handler = (
  method: RouteType,
  routeDefinition: RouteDefinition
): RequestHandler[] => {
  const handlers = routeDefinition[method];

  if (handlers) return handlers;

  if (method === 'ALL') return [empty];
  return [notImplemented];
};

const hasMiddleware = (routeDefinition: RouteDefinition): boolean => {
  return Object.keys(routeDefinition).includes('USE');
};

const hasRoute = (routeDefintion: RouteDefinition): boolean => {
  const routeMethods = ['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  return (
    Object.keys(routeDefintion).filter((method) =>
      routeMethods.includes(method)
    ).length > 0
  );
};

export const injectRoutes = (opts: {
  router: Router;
  routes: Routes;
}): Router => {
  const { router, routes } = opts;

  routes.forEach(([path, routeDefinition]) => {
    if (hasMiddleware(routeDefinition)) {
      router.use(handler('USE', routeDefinition));
    }

    if (hasRoute(routeDefinition)) {
      router
        .route(path)
        .all(handler('ALL', routeDefinition))
        .get(handler('GET', routeDefinition))
        .post(handler('POST', routeDefinition))
        .put(handler('PUT', routeDefinition))
        .patch(handler('PATCH', routeDefinition))
        .delete(handler('DELETE', routeDefinition));
    }
  });

  router.route('*').all(notImplemented);

  return router;
};
