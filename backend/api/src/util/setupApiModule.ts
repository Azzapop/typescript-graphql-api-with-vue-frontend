import type { Router, ErrorRequestHandler, Express, RequestHandler } from 'express'
import express from "express";

type Middleware = RequestHandler | Array<RequestHandler>

export const setupApiModule = (opts: { routes: Router, middleware: Middleware[], errorHandler: ErrorRequestHandler }): Express => {
  const { routes, middleware, errorHandler } = opts

  const app = express()

  middleware.forEach((middlewareFunc) => app.use(middlewareFunc));
  app.use(routes);
  app.use(errorHandler)

  return app;
}
