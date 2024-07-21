import type { RequestHandler } from 'express';

export type RouteType =
  | 'USE'
  | 'ALL'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

// We allow `any` here as route handlers can have many different types passed to them
// for params, body, query, etc
/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteDefinition = Partial<
  Record<RouteType, RequestHandler<any, any, any, any, any>[]>
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type Routes = Array<[string, RouteDefinition]>;
