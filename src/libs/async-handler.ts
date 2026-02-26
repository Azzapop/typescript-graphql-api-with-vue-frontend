import type { RequestHandler } from 'express';

// TODO better typing here
/* eslint-disable @typescript-eslint/no-explicit-any */
type Handler = RequestHandler<any, any, any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/*
 * Use this helper to wrap any async functions and ensure their errors
 * are passed along to the application error handler
 */
export const asyncHandler = (handler: Handler) => {
  const wrapper: Handler = (req, res, next): Promise<void> => {
    const handlerReturn = handler(req, res, next);
    return Promise.resolve(handlerReturn).catch(next);
  };

  return wrapper;
};
