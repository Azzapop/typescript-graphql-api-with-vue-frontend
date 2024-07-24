import type { RequestHandler } from 'express';

// TODO better typing here
/* eslint-disable @typescript-eslint/no-explicit-any */
type Handler = RequestHandler<any, any, any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const asyncHanlder = (handler: Handler) => {
  const wrapper: Handler = (req, res, next): Promise<void> => {
    const handlerReturn = handler(req, res, next);
    return Promise.resolve(handlerReturn).catch(next);
  };

  return wrapper;
};
